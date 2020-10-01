import { addToData } from "../../generate.js";
import { TypeBuilder, TypeCreator } from "../../types/index.js";
import { getItem, upperCaseFirst } from "../../utils.js";

/**
 * Build types for objects that have queries enabled
 * Does it in 2 passes:
 *  - Create the basic sql type
 *  - Add relations to the sql type
 * @param {CodeGenStructure} data
 */
export function buildExtraTypes(data) {
  for (const group of Object.keys(data)) {
    for (const name of Object.keys(data[group])) {
      const item = data[group][name];

      if (!item.enableQueries || item.type !== "object") {
        continue;
      }

      if (!item._didSqlGenerate) {
        buildSqlType(data, item);
      } else if (!item._didSqlSelectJoinGenerate) {
        buildSqlSelectJoinType(data, item);
      }
    }
  }
}

function buildSqlType(data, item) {
  const { group, name } = item;
  // withSoftDeletes implies withDates
  if (item?.queryOptions?.withDates || item?.queryOptions?.withSoftDeletes) {
    addDateFields(item);
  }

  // The sql generator filters on type === "sql"
  const queryType = {
    type: "sql",
    group: group,
    name: `${name}Sql`,
    original: {
      group: group,
      name: name,
    },
    shortName: shortName(item.name),
  };

  addToData(data, queryType);

  const where = getWhereFields(item);
  addToData(data, where.type);

  const partial = getPartialFields(item);
  addToData(data, partial.type);

  queryType.whereFields = where.fieldsArray;
  queryType.partialFields = partial.fieldsArray;

  item._didSqlGenerate = true;
}

function buildSqlSelectJoinType(data, item) {
  // Bruteforce way of getting all relations
  const relations = [];
  for (const group of Object.keys(data)) {
    for (const name of Object.keys(data[group])) {
      const rel = data[group][name];
      if (rel.type === "relation") {
        const left = getItem(rel.left);
        if (left.group === item.group && left.name === item.name) {
          relations.push(rel);
        }
      }
    }
  }

  const queryType = data[item.group][`${item.name}Sql`];
  queryType.relations = [];

  const T = new TypeCreator(item.group);
  for (const rel of relations) {
    if (rel.relationType === "manyToOne") {
      buildSqlSelectJoinForManyToOne(data, item, rel, T, queryType);
    } else if (rel.relationType === "oneToMany") {
      buildSqlSelectJoinForOneToMany(data, item, rel, T, queryType);
    }
  }

  item._didSqlSelectJoinGenerate = true;
}

/**
 * @param data
 * @param item
 * @param relation
 * @param T
 * @param queryType
 */
function buildSqlSelectJoinForManyToOne(data, item, relation, T, queryType) {
  const rightSide = getItem(relation.right);

  // Useful data for the template
  const relationMeta = {
    type: "manyToOne",
    name: `${item.name}With${upperCaseFirst(relation.substituteKey)}`,
    whereType: undefined,
    selectName: `${item.name}SelectWith${upperCaseFirst(
      relation.substituteKey,
    )}`,
    rightShortName: shortName(rightSide.name),
    rightName: rightSide.name,
    rightGroup: rightSide.group,
    leftKey: relation.leftKey,
    rightKey: relation.rightKey,
    substituteKey: relation.substituteKey,
  };

  // Creates the new type with field added
  const relationRef = T.reference(rightSide.group, rightSide.name);

  if (relation.isOptional) {
    relationRef.optional();
  }

  addToData(data, {
    ...item,
    name: relationMeta.name,
    keys: {
      ...item.keys,
      [relation.substituteKey]: relationRef.build(),
    },
    enableQueries: false,
  });

  // Creates the new where type with embedded where for the joined type
  const whereItem = {
    ...data[item.group][`${item.name}Where`],
    name: `${relationMeta.name}Where`,
    keys: {
      ...data[item.group][`${item.name}Where`].keys,
      [relation.substituteKey]: T.reference(
        rightSide.group,
        `${rightSide.name}Where`,
      )
        .optional()
        .build(),
    },
  };
  addToData(data, whereItem);
  relationMeta.whereType = whereItem.uniqueName;

  queryType.relations.push(relationMeta);
}

/**
 * @param data
 * @param item
 * @param relation
 * @param T
 * @param queryType
 */
function buildSqlSelectJoinForOneToMany(data, item, relation, T, queryType) {
  const rightSide = getItem(relation.right);

  // Useful data for the template
  const relationMeta = {
    type: "oneToMany",
    name: `${item.name}With${upperCaseFirst(relation.substituteKey)}`,
    whereType: undefined,
    selectName: `${item.name}SelectWith${upperCaseFirst(
      relation.substituteKey,
    )}`,
    rightShortName: shortName(rightSide.name),
    rightName: rightSide.name,
    rightGroup: rightSide.group,
    leftKey: relation.leftKey,
    rightKey: relation.rightKey,
    substituteKey: relation.substituteKey,
  };

  // Creates the new type with field added
  addToData(data, {
    ...item,
    name: relationMeta.name,
    keys: {
      ...item.keys,
      [relation.substituteKey]: T.array()
        .values(T.reference(rightSide.group, rightSide.name))
        .build(),
    },
    enableQueries: false,
  });

  // Creates the new where type with embedded where for the joined type
  const whereItem = {
    ...data[item.group][`${item.name}Where`],
    name: `${relationMeta.name}Where`,
    keys: {
      ...data[item.group][`${item.name}Where`].keys,
      [relation.substituteKey]: T.reference(
        rightSide.group,
        `${rightSide.name}Where`,
      )
        .optional()
        .build(),
    },
  };
  addToData(data, whereItem);
  relationMeta.whereType = whereItem.uniqueName;

  queryType.relations.push(relationMeta);
}

/**
 * Add createdAt and updatedAt to this item
 * These fields are optional as either LBU or Postgres will fill them
 *
 * @param item
 */
function addDateFields(item) {
  item.keys.createdAt = {
    ...TypeBuilder.getBaseData(),
    ...TypeCreator.types.get("date").class.getBaseData(),
    type: "date",
    defaultValue: "(new Date())",
    isOptional: true,
    sql: {
      searchable: true,
    },
  };
  item.keys.updatedAt = {
    ...TypeBuilder.getBaseData(),
    ...TypeCreator.types.get("date").class.getBaseData(),
    type: "date",
    defaultValue: "(new Date())",
    isOptional: true,
    sql: {
      searchable: true,
    },
  };

  if (item.queryOptions?.withSoftDeletes) {
    item.keys.deletedAt = {
      ...TypeBuilder.getBaseData(),
      ...TypeCreator.types.get("date").class.getBaseData(),
      type: "date",
      isOptional: true,
      sql: {
        searchable: true,
      },
    };
  }
}

/**
 * Get where fields and input type
 *
 * @param item
 * @returns {{type: object, fieldsArray: *[]}}
 */
function getWhereFields(item) {
  const fieldsArray = [];
  const resultType = {
    ...TypeBuilder.getBaseData(),
    ...TypeCreator.types.get("object").class.getBaseData(),
    type: "object",
    group: item.group,
    name: `${item.name}Where`,
    keys: {},
  };

  for (const key of Object.keys(item.keys)) {
    const it = getItem(item.keys[key]);

    if (!it?.sql?.searchable) {
      continue;
    }

    // Also supports referenced fields
    const type = it.type;
    const settings = {
      name: undefined,
      group: undefined,
      uniqueName: undefined,
      isOptional: true,
      defaultValue: undefined,
    };

    if (
      key === "deletedAt" &&
      item.queryOptions?.withSoftDeletes &&
      type === "date"
    ) {
      fieldsArray.push({
        key,
        name: "deletedAtInclude",
        type: "includeNotNull",
      });
      resultType.keys["deletedAtInclude"] = {
        ...TypeBuilder.getBaseData(),
        ...TypeCreator.types.get("boolean").class.getBaseData(),
        ...settings,
      };

      resultType.docString += `By default 'where.deletedAtInclude' will only include 'null' values. To use the other generated variants like 'deletedAtGreaterThan', set this value to 'true'.`;
    }

    if (type === "number" || type === "date") {
      // Generate =, > and < queries

      fieldsArray.push(
        {
          key,
          name: key,
          type: "equal",
        },
        { key, name: `${key}GreaterThan`, type: "greaterThan" },
        { key, name: `${key}LowerThan`, type: "lowerThan" },
      );

      resultType.keys[key] = { ...it, ...settings };
      resultType.keys[`${key}GreaterThan`] = { ...it, ...settings };
      resultType.keys[`${key}LowerThan`] = { ...it, ...settings };
    } else if (type === "string") {
      // Generate = and LIKE %input% queries

      fieldsArray.push(
        { key, name: key, type: "equal" },
        { key, name: `${key}Like`, type: "like" },
      );

      resultType.keys[key] = { ...it, ...settings };
      resultType.keys[`${key}Like`] = { ...it, ...settings };
    } else if (type === "uuid") {
      // Generate = and IN (uuid1, uuid2) queries
      fieldsArray.push(
        { key, name: key, type: "equal" },
        { key, name: `${key}In`, type: "in" },
      );

      resultType.keys[key] = { ...it, ...settings };
      resultType.keys[`${key}In`] = {
        ...TypeBuilder.getBaseData(),
        ...TypeCreator.types.get("array").class.getBaseData(),
        type: "array",
        isOptional: true,
        values: { ...it, ...settings, isOptional: it.isOptional },
      };
    }
  }

  return { fieldsArray, type: resultType };
}

/**
 * Get where fields and input type
 *
 * @param item
 * @returns {{type: object, fieldsArray: *[]}}
 */
function getPartialFields(item) {
  const fieldsArray = [];
  const resultType = {
    ...TypeBuilder.getBaseData(),
    ...TypeCreator.types.get("object").class.getBaseData(),
    type: "object",
    group: item.group,
    name: `${item.name}InsertPartial`,
    keys: {},
  };

  for (const key of Object.keys(item.keys)) {
    const it = item.keys[key];

    // Partial updates don't need to update primary key
    if (it?.sql?.primary) {
      continue;
    }

    // Support updating referenced field
    // We follow through with the default value, so if the reference it self doesn't
    // have a default value we use the default value of the referenced type
    const { type, defaultValue } = getItem(it);

    // JSON.stringify all values that are not 'primitives'
    // So the user will can have a lbu GenericType into a JSONB field
    fieldsArray.push({
      source: key,
      defaultValue: it.defaultValue ?? defaultValue,
      stringify:
        ["number", "boolean", "string", "date", "uuid"].indexOf(type) === -1,
    });

    resultType.keys[key] = { ...it };
  }

  return { fieldsArray, type: resultType };
}

/**
 * FileHistory => fh
 * @param {string} name
 * @returns {string}
 */
function shortName(name) {
  return name
    .split(/(?=[A-Z])/)
    .map((it) => (it[0] || "").toLowerCase())
    .join("");
}
