/**
 * Format and append query parts, and execute the final result in a safe way.
 * Undefined values are skipped, as they are not allowed in queries.
 * The query call may be one of the interpolated values. Supports being called as a
 * template literal.
 *
 * @since 0.1.0
 *
 * @template T
 *
 * @param {TemplateStringsArray | string[]} strings
 * @param {...(import("../types/advanced-types").QueryPartArg
 *   | import("../types/advanced-types").QueryPartArg[]
 *   )} values
 * @returns {import("../types/advanced-types").QueryPart<T>}
 */
export function query<T>(
  strings: TemplateStringsArray | string[],
  ...values: (
    | import("../types/advanced-types").QueryPartArg
    | import("../types/advanced-types").QueryPartArg[]
  )[]
): import("../types/advanced-types").QueryPart<T>;
/**
 * Check if the passed in value is an object generated by 'query``'.
 *
 * @since 0.1.0
 *
 * @param {any} query
 * @returns {query is import("../types/advanced-types").QueryPart<any>}
 */
export function isQueryPart(
  query: any,
): query is import("../types/advanced-types").QueryPart<any>;
/**
 * Stringify a queryPart.
 * When interpolateParameters is true, we do a best effort in replacing the parameterized
 * query with the real params. If the result doesn't look right, please turn it off.
 *
 * @since 0.1.0
 *
 * @param {import("../types/advanced-types").QueryPart<any>} queryPart
 * @param {{ interpolateParameters?: boolean }} options
 * @returns {string|{ sql?: string, params?: *[] }}
 */
export function stringifyQueryPart(
  queryPart: import("../types/advanced-types").QueryPart<any>,
  {
    interpolateParameters,
  }?: {
    interpolateParameters?: boolean;
  },
):
  | string
  | {
      sql?: string | undefined;
      params?: any[] | undefined;
    };
/**
 * Creates a transaction, executes the query, and rollback the transaction afterwards.
 * This is safe to use with insert, update and delete queries.
 *
 * By default returns text, but can also return json.
 * Note that explain output is highly depended on the current data and usage of the
 * tables.
 *
 * @since 0.1.0
 *
 * @param {import("postgres").Sql<{}>} sql
 * @param {import("../types/advanced-types").QueryPart<any>} queryItem
 * @param {{ jsonResult?: boolean }} [options={}]
 * @returns {Promise<string|object>}
 */
export function explainAnalyzeQuery(
  sql: import("postgres").Sql<{}>,
  queryItem: import("../types/advanced-types").QueryPart<any>,
  {
    jsonResult,
  }?:
    | {
        jsonResult?: boolean | undefined;
      }
    | undefined,
): Promise<string | object>;
//# sourceMappingURL=query.d.ts.map
