/**
 * @name QueryPart
 * @typedef {object}
 * @property {string[]} strings
 * @property {*[]} values
 * @property {function(QueryPart): QueryPart} append
 * @property {function(Postgres): postgres.PendingQuery} exec
 */

/**
 * Format and append query parts, and exec the final result in a safe way.
 * Undefined values are skipped, as they are not allowed in queries.
 *
 * @param {string[]} strings
 * @param {...*} values
 * @returns {QueryPart}
 */
export function query(strings, ...values) {
  let _strings = [];
  const _values = [];

  const result = {
    get strings() {
      return _strings;
    },
    get values() {
      return _values;
    },
    append,
    exec,
  };

  // Flatten nested query parts
  let didFlatten = false;
  for (let i = 0; i < strings.length - 1; ++i) {
    if (didFlatten) {
      didFlatten = false;
      _strings[_strings.length - 1] += strings[i];
    } else {
      _strings.push(strings[i]);
    }
    if (Array.isArray(values[i]?.strings) && Array.isArray(values[i]?.values)) {
      append(values[i]);
      didFlatten = true;
    } else {
      _values.push(values[i]);
    }
  }

  if (didFlatten) {
    _strings[_strings.length - 1] += strings[strings.length - 1];
  } else {
    _strings.push(strings[strings.length - 1]);
  }

  return result;

  function append(query) {
    const last = _strings[_strings.length - 1];
    const [first, ...rest] = query.strings;
    _strings = [..._strings.slice(0, -1), `${last} ${first}`, ...rest];
    _values.push.apply(_values, query.values);
    return result;
  }

  function exec(sql) {
    let str = _strings[0];
    let valueIdx = 1;
    for (let i = 0; i < _values.length; ++i) {
      if (_values[i] === undefined) {
        str += `${_strings[i + 1]}`;
      } else {
        str += `$${valueIdx++}${_strings[i + 1]}`;
      }
    }

    // Strip out undefined values
    return sql.unsafe(
      str,
      _values.filter((it) => it !== undefined),
    );
  }
}

/**
 * Creates a transaction, executes the query, and rollback the transaction afterwards.
 * This is safe to use with insert, update and delete queries.
 *
 * By default returns text, but can also return json.
 * Note that explain output is highly depended on the current data and usage of the tables.
 *
 * @param {Postgres} sql
 * @param {QueryPart} queryItem
 * @param {boolean} [jsonResult]=false
 * @returns {Promise<string|object>}
 */
export async function explainAnalyzeQuery(sql, queryItem, { jsonResult } = {}) {
  let result;

  try {
    await sql.begin(async (sql) => {
      if (jsonResult) {
        const intermediate = await query`EXPLAIN (ANALYZE, VERBOSE, BUFFERS, FORMAT JSON) ${queryItem}`.exec(
          sql,
        );
        result = intermediate[0];
      } else {
        const intermediate = await query`EXPLAIN (ANALYZE, VERBOSE, BUFFERS, FORMAT TEXT) ${queryItem}`.exec(
          sql,
        );

        result = intermediate.map((it) => it["QUERY PLAN"]).join("\n");
      }
      // Rollback the transaction
      throw new Error();
    });
  } catch {
    // Ignore
  }

  return result;
}
