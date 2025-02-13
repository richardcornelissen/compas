// @ts-nocheck

import { isNil } from "@compas/stdlib";
import { ObjectType } from "../../builders/ObjectType.js";
import { upperCaseFirst } from "../../utils.js";
import { js } from "../tag/index.js";
import { getTypeNameForType } from "../types.js";
import {
  getPrimaryKeyWithType,
  getQueryEnabledObjects,
  getSortedKeysForType,
} from "./utils.js";

/**
 * Creates the partial types for inserts and updates and assigns in to the object type
 *
 * @param {import("../../generated/common/types").CodeGenContext} context
 */
export function createPartialTypes(context) {
  for (const type of getQueryEnabledObjects(context)) {
    if (type.queryOptions?.isView) {
      continue;
    }

    const fieldsArray = [];

    const insertPartial = new ObjectType(
      type.group,
      `${type.name}InsertPartial`,
    ).build();
    insertPartial.uniqueName = `${upperCaseFirst(
      insertPartial.group,
    )}${upperCaseFirst(insertPartial.name)}`;

    for (const key of getSortedKeysForType(type)) {
      let fieldType = type.keys[key];
      if (fieldType.reference) {
        fieldType = fieldType.reference;
      }

      if (fieldType?.sql?.primary) {
        // Primary keys have some special handling in insertValues, but are completely
        // skipped in updateSet. However, it is handled inline and thus not put in to the
        // fieldsArray
        insertPartial.keys[key] = {
          ...fieldType,
          isOptional: true,
        };
        continue;
      }

      const hasSqlDefault =
        fieldType.sql?.hasDefaultValue ?? type.keys[key].sql?.hasDefaultValue;

      // Default value is the edge case here.
      // We also support setting a default value for the reference, so fields can be
      // reused but only have a default value on the reference.
      fieldsArray.push({
        key,
        isJsonb:
          ["number", "boolean", "string", "date", "uuid"].indexOf(
            fieldType.type,
          ) === -1,
        defaultValue: fieldType.defaultValue ?? type.keys[key].defaultValue,
        hasSqlDefault,
      });

      insertPartial.keys[key] = {
        ...fieldType,
        isOptional: hasSqlDefault || fieldType.isOptional,
      };

      // Create correct types by setting allowNull, since the value will be used in the
      // update statement
      if (
        fieldType.sql?.hasDefaultValue ||
        (fieldType.isOptional && isNil(fieldType.defaultValue))
      ) {
        insertPartial.keys[key].validator = Object.assign(
          {},
          {
            ...(fieldType?.validator ?? {}),
            allowNull: true,
          },
        );
      }
    }

    type.partial = type.partial ?? {};
    type.partial.insertType = getTypeNameForType(context, insertPartial, "", {
      useDefaults: false,
    });
    type.partial.fields = fieldsArray;
  }
}

/**
 * Adds builder to reuse inserts
 *
 * @param {import("../../generated/common/types").CodeGenContext} context
 * @param {CodeGenObjectType} type
 */
export function getInsertPartial(context, type) {
  const { key: primaryKey } = getPrimaryKeyWithType(type);

  return js`
    /**
     * Build 'VALUES ' part for ${type.name}
     *
     * @param {${type.partial.insertType}|${type.partial.insertType}[]} insert
     * @param {{ includePrimaryKey?: boolean }} [options={}]
     * @returns {QueryPart}
     */
    export function ${type.name}InsertValues(insert, options = {}) {
      if (!Array.isArray(insert)) {
        insert = [ insert ];
      }

      const str = [];
      const args = [];

      for (let i = 0; i < insert.length; ++i) {
        const it = insert[i];
        checkFieldsInSet("${type.name}", "insert", ${type.name}FieldSet, it);

        str.push("(");
        if (options?.includePrimaryKey) {
          args.push(it.${primaryKey});
          str.push(", ");
        }

        ${type.partial.fields
          .map((it) => {
            if (it.hasSqlDefault) {
              return `if (isNil(it.${it.key})) {
              args.push(undefined);
              str.push("DEFAULT, ");
            } else {
              args.push(it.${it.key} ?? ${it.defaultValue ?? "null"});
              str.push(", ");
            }`;
            } else if (it.isJsonb) {
              return `
                args.push(JSON.stringify(it.${it.key} ?? ${
                it.defaultValue ?? "null"
              }));
                str.push(", ");
              `;
            }
            return `
                args.push(it.${it.key} ?? ${it.defaultValue ?? "null"});
                str.push(", ");
              `;
          })
          .join("\n")}

        // Fixup last comma & add undefined arg so strings are concatted correctly  
        const lastStrIdx = str.length - 1;
        str[lastStrIdx] = str[lastStrIdx].substring(0, str[lastStrIdx].length - 2);
        args.push(undefined);


        str.push(")");
        args.push(undefined);

        if (i !== insert.length - 1) {
          args.push(undefined);
          str.push(",");
        }
      }

      if (args.length > 100000) {
        throw AppError.serverError({
                                     message: "Insert array has too many values, split up your array in smaller batches and execute '${
                                       type.name
                                     }Insert' multiple times."
                                   })
      }

      return query(str, ...args);
    }
  `;
}
