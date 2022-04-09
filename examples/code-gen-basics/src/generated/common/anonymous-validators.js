// Generated by @compas/code-gen
/* eslint-disable no-unused-vars */

import { isNil } from "@compas/stdlib";

/**
 * @typedef {{
 *   propertyPath: string,
 *   key: string,
 *   info: any,
 * }} InternalError
 */

/**
 * @template T
 * @typedef {import("@compas/stdlib").EitherN<T, InternalError>} EitherN
 */

const objectKeys23916476 = new Set(["todo"]);
const objectKeys1231411047 = new Set(["id", "task", "metadata", "createdAt"]);
const objectKeys1814910903 = new Set(["tags", "isUrgent"]);
const objectKeys1944484315 = new Set(["id"]);
const objectKeys1850411744 = new Set(["success"]);
const objectKeys366487642 = new Set(["task", "metadata"]);
const objectKeys712084859 = new Set(["todos"]);
const objectKeys248765300 = new Set(["id"]);
const objectKeys1328493231 = new Set(["todo"]);
/**
 * @param {*} value
 * @param {string} propertyPath
 * @returns {EitherN<any>}
 */
export function anonymousValidator1177598259(value, propertyPath) {
  if (isNil(value)) {
    /** @type {{ errors: InternalError[] }} */
    return {
      errors: [
        {
          propertyPath,
          key: "validator.any.undefined",
          info: {},
        },
      ],
    };
  }
  return { value };
}
/**
 * @param {*} value
 * @param {string} propertyPath
 * @returns {EitherN<string>}
 */
export function anonymousValidator981662321(value, propertyPath) {
  if (isNil(value)) {
    /** @type {{ errors: InternalError[] }} */
    return {
      errors: [
        {
          propertyPath,
          key: "validator.string.undefined",
          info: {},
        },
      ],
    };
  }
  if (typeof value !== "string") {
    /** @type {{ errors: InternalError[] }} */
    return {
      errors: [
        {
          propertyPath,
          key: "validator.string.type",
          info: {},
        },
      ],
    };
  }
  value = value.trim();
  if (value.length < 36) {
    const min = 36;
    /** @type {{ errors: InternalError[] }} */
    return {
      errors: [
        {
          propertyPath,
          key: "validator.string.min",
          info: { min },
        },
      ],
    };
  }
  if (value.length > 36) {
    const max = 36;
    /** @type {{ errors: InternalError[] }} */
    return {
      errors: [
        {
          propertyPath,
          key: "validator.string.max",
          info: { max },
        },
      ],
    };
  }
  value = value.toLowerCase();
  if (
    !/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[a-f0-9]{4}-[a-f0-9]{12}$/gi.test(
      value,
    )
  ) {
    /** @type {{ errors: InternalError[] }} */
    return {
      errors: [
        {
          propertyPath,
          key: "validator.string.pattern",
          info: {},
        },
      ],
    };
  }
  return { value };
}
/**
 * @param {*} value
 * @param {string} propertyPath
 * @returns {EitherN<string>}
 */
export function anonymousValidator56355924(value, propertyPath) {
  if (isNil(value)) {
    /** @type {{ errors: InternalError[] }} */
    return {
      errors: [
        {
          propertyPath,
          key: "validator.uuid.undefined",
          info: {},
        },
      ],
    };
  }
  return anonymousValidator981662321(value, propertyPath);
}
/**
 * @param {*} value
 * @param {string} propertyPath
 * @returns {EitherN<string>}
 */
export function anonymousValidator186795873(value, propertyPath) {
  if (isNil(value)) {
    /** @type {{ errors: InternalError[] }} */
    return {
      errors: [
        {
          propertyPath,
          key: "validator.string.undefined",
          info: {},
        },
      ],
    };
  }
  if (typeof value !== "string") {
    /** @type {{ errors: InternalError[] }} */
    return {
      errors: [
        {
          propertyPath,
          key: "validator.string.type",
          info: {},
        },
      ],
    };
  }
  if (value.length < 1) {
    const min = 1;
    /** @type {{ errors: InternalError[] }} */
    return {
      errors: [
        {
          propertyPath,
          key: "validator.string.min",
          info: { min },
        },
      ],
    };
  }
  return { value };
}
/**
 * @param {*} value
 * @param {string} propertyPath
 * @returns {EitherN<(string)[]>}
 */
export function anonymousValidator1898391521(value, propertyPath) {
  if (isNil(value)) {
    /** @type {{ errors: InternalError[] }} */
    return {
      errors: [
        {
          propertyPath,
          key: "validator.array.undefined",
          info: {},
        },
      ],
    };
  }
  if (!Array.isArray(value)) {
    /** @type {{ errors: InternalError[] }} */
    return {
      errors: [
        {
          propertyPath,
          key: "validator.array.type",
          info: {},
        },
      ],
    };
  }
  const result = Array.from({ length: value.length });
  let errors = [];
  for (let i = 0; i < value.length; ++i) {
    const arrVar = anonymousValidator186795873(
      value[i],
      propertyPath + "[" + i + "]",
    );
    if (arrVar.errors) {
      errors.push(...arrVar.errors);
    } else {
      result[i] = arrVar.value;
    }
  }
  if (errors.length > 0) {
    /** @type {{ errors: InternalError[] }} */
    return { errors };
  }
  return { value: result };
}
/**
 * @param {*} value
 * @param {string} propertyPath
 * @returns {EitherN<boolean>}
 */
export function anonymousValidator2047524467(value, propertyPath) {
  if (isNil(value)) {
    /** @type {{ errors: InternalError[] }} */
    return {
      errors: [
        {
          propertyPath,
          key: "validator.boolean.undefined",
          info: {},
        },
      ],
    };
  }
  if (typeof value !== "boolean") {
    /** @type {{ errors: InternalError[] }} */
    return {
      errors: [
        {
          propertyPath,
          key: "validator.boolean.type",
          info: {},
        },
      ],
    };
  }
  return { value };
}
/**
 * @param {*} value
 * @param {string} propertyPath
 * @returns {EitherN<{"tags": (string)[], "isUrgent": boolean, }>}
 */
export function anonymousValidator1814910903(value, propertyPath) {
  if (isNil(value)) {
    /** @type {{ errors: InternalError[] }} */
    return {
      errors: [
        {
          propertyPath,
          key: "validator.object.undefined",
          info: {},
        },
      ],
    };
  }
  if (typeof value !== "object") {
    /** @type {{ errors: InternalError[] }} */
    return {
      errors: [
        {
          propertyPath,
          key: "validator.object.type",
          info: {},
        },
      ],
    };
  }
  const result = Object.create(null);
  let errors = [];
  for (const key of Object.keys(value)) {
    if (!objectKeys1814910903.has(key)) {
      /** @type {{ errors: InternalError[] }} */
      return {
        errors: [
          {
            propertyPath,
            key: "validator.object.strict",
            info: { extraKey: key },
          },
        ],
      };
    }
  }
  /**
   * @type {[string, (value: *, propertyPath: string) => EitherN<*>][]}
   */
  const validatorPairs = [
    ["tags", anonymousValidator1898391521],
    ["isUrgent", anonymousValidator2047524467],
  ];
  for (const [key, validator] of validatorPairs) {
    const validatorResult = validator(value[key], `${propertyPath}.${key}`);
    if (validatorResult.errors) {
      errors.push(...validatorResult.errors);
    } else {
      result[key] = validatorResult.value;
    }
  }
  if (errors.length > 0) {
    return { errors };
  }
  return { value: result };
}
/**
 * @param {*} value
 * @param {string} propertyPath
 * @returns {EitherN<Date>}
 */
export function anonymousValidator448481401(value, propertyPath) {
  if (isNil(value)) {
    /** @type {{ errors: InternalError[] }} */
    return {
      errors: [
        {
          propertyPath,
          key: "validator.date.undefined",
          info: {},
        },
      ],
    };
  }
  if (
    typeof value !== "string" &&
    typeof value !== "number" &&
    !(value instanceof Date)
  ) {
    /** @type {{ errors: InternalError[] }} */
    return {
      errors: [
        {
          propertyPath,
          key: "validator.date.invalid",
          info: {},
        },
      ],
    };
  }
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    /** @type {{ errors: InternalError[] }} */
    return {
      errors: [
        {
          propertyPath,
          key: "validator.date.invalid",
          info: {},
        },
      ],
    };
  }
  return { value: date };
}
/**
 * @param {*} value
 * @param {string} propertyPath
 * @returns {EitherN<{"id": string, "task": string, "metadata": {"tags": (string)[], "isUrgent": boolean, }, "createdAt": Date, }>}
 */
export function anonymousValidator1231411047(value, propertyPath) {
  if (isNil(value)) {
    /** @type {{ errors: InternalError[] }} */
    return {
      errors: [
        {
          propertyPath,
          key: "validator.object.undefined",
          info: {},
        },
      ],
    };
  }
  if (typeof value !== "object") {
    /** @type {{ errors: InternalError[] }} */
    return {
      errors: [
        {
          propertyPath,
          key: "validator.object.type",
          info: {},
        },
      ],
    };
  }
  const result = Object.create(null);
  let errors = [];
  for (const key of Object.keys(value)) {
    if (!objectKeys1231411047.has(key)) {
      /** @type {{ errors: InternalError[] }} */
      return {
        errors: [
          {
            propertyPath,
            key: "validator.object.strict",
            info: { extraKey: key },
          },
        ],
      };
    }
  }
  /**
   * @type {[string, (value: *, propertyPath: string) => EitherN<*>][]}
   */
  const validatorPairs = [
    ["id", anonymousValidator56355924],
    ["task", anonymousValidator186795873],
    ["metadata", anonymousValidator1814910903],
    ["createdAt", anonymousValidator448481401],
  ];
  for (const [key, validator] of validatorPairs) {
    const validatorResult = validator(value[key], `${propertyPath}.${key}`);
    if (validatorResult.errors) {
      errors.push(...validatorResult.errors);
    } else {
      result[key] = validatorResult.value;
    }
  }
  if (errors.length > 0) {
    return { errors };
  }
  return { value: result };
}
/**
 * @param {*} value
 * @param {string} propertyPath
 * @returns {EitherN<TodoItem>}
 */
export function anonymousValidator40283585(value, propertyPath) {
  if (isNil(value)) {
    /** @type {{ errors: InternalError[] }} */
    return {
      errors: [
        {
          propertyPath,
          key: "validator.reference.undefined",
          info: {},
        },
      ],
    };
  }
  return anonymousValidator1231411047(value, propertyPath);
}
/**
 * @param {*} value
 * @param {string} propertyPath
 * @returns {EitherN<{"todo": TodoItem, }>}
 */
export function anonymousValidator23916476(value, propertyPath) {
  if (isNil(value)) {
    /** @type {{ errors: InternalError[] }} */
    return {
      errors: [
        {
          propertyPath,
          key: "validator.object.undefined",
          info: {},
        },
      ],
    };
  }
  if (typeof value !== "object") {
    /** @type {{ errors: InternalError[] }} */
    return {
      errors: [
        {
          propertyPath,
          key: "validator.object.type",
          info: {},
        },
      ],
    };
  }
  const result = Object.create(null);
  let errors = [];
  for (const key of Object.keys(value)) {
    if (!objectKeys23916476.has(key)) {
      /** @type {{ errors: InternalError[] }} */
      return {
        errors: [
          {
            propertyPath,
            key: "validator.object.strict",
            info: { extraKey: key },
          },
        ],
      };
    }
  }
  /**
   * @type {[string, (value: *, propertyPath: string) => EitherN<*>][]}
   */
  const validatorPairs = [["todo", anonymousValidator40283585]];
  for (const [key, validator] of validatorPairs) {
    const validatorResult = validator(value[key], `${propertyPath}.${key}`);
    if (validatorResult.errors) {
      errors.push(...validatorResult.errors);
    } else {
      result[key] = validatorResult.value;
    }
  }
  if (errors.length > 0) {
    return { errors };
  }
  return { value: result };
}
/**
 * @param {*} value
 * @param {string} propertyPath
 * @returns {EitherN<{"id": string, }>}
 */
export function anonymousValidator1944484315(value, propertyPath) {
  if (isNil(value)) {
    /** @type {{ errors: InternalError[] }} */
    return {
      errors: [
        {
          propertyPath,
          key: "validator.object.undefined",
          info: {},
        },
      ],
    };
  }
  if (typeof value !== "object") {
    /** @type {{ errors: InternalError[] }} */
    return {
      errors: [
        {
          propertyPath,
          key: "validator.object.type",
          info: {},
        },
      ],
    };
  }
  const result = Object.create(null);
  let errors = [];
  for (const key of Object.keys(value)) {
    if (!objectKeys1944484315.has(key)) {
      /** @type {{ errors: InternalError[] }} */
      return {
        errors: [
          {
            propertyPath,
            key: "validator.object.strict",
            info: { extraKey: key },
          },
        ],
      };
    }
  }
  /**
   * @type {[string, (value: *, propertyPath: string) => EitherN<*>][]}
   */
  const validatorPairs = [["id", anonymousValidator56355924]];
  for (const [key, validator] of validatorPairs) {
    const validatorResult = validator(value[key], `${propertyPath}.${key}`);
    if (validatorResult.errors) {
      errors.push(...validatorResult.errors);
    } else {
      result[key] = validatorResult.value;
    }
  }
  if (errors.length > 0) {
    return { errors };
  }
  return { value: result };
}
/**
 * @param {*} value
 * @param {string} propertyPath
 * @returns {EitherN<true>}
 */
export function anonymousValidator1006701760(value, propertyPath) {
  if (isNil(value)) {
    /** @type {{ errors: InternalError[] }} */
    return {
      errors: [
        {
          propertyPath,
          key: "validator.boolean.undefined",
          info: {},
        },
      ],
    };
  }
  if (typeof value !== "boolean") {
    /** @type {{ errors: InternalError[] }} */
    return {
      errors: [
        {
          propertyPath,
          key: "validator.boolean.type",
          info: {},
        },
      ],
    };
  }
  if (value !== true) {
    const oneOf = true;
    /** @type {{ errors: InternalError[] }} */
    return {
      errors: [
        {
          propertyPath,
          key: "validator.boolean.oneOf",
          info: { oneOf },
        },
      ],
    };
  }
  return { value };
}
/**
 * @param {*} value
 * @param {string} propertyPath
 * @returns {EitherN<{"success": true, }>}
 */
export function anonymousValidator1850411744(value, propertyPath) {
  if (isNil(value)) {
    /** @type {{ errors: InternalError[] }} */
    return {
      errors: [
        {
          propertyPath,
          key: "validator.object.undefined",
          info: {},
        },
      ],
    };
  }
  if (typeof value !== "object") {
    /** @type {{ errors: InternalError[] }} */
    return {
      errors: [
        {
          propertyPath,
          key: "validator.object.type",
          info: {},
        },
      ],
    };
  }
  const result = Object.create(null);
  let errors = [];
  for (const key of Object.keys(value)) {
    if (!objectKeys1850411744.has(key)) {
      /** @type {{ errors: InternalError[] }} */
      return {
        errors: [
          {
            propertyPath,
            key: "validator.object.strict",
            info: { extraKey: key },
          },
        ],
      };
    }
  }
  /**
   * @type {[string, (value: *, propertyPath: string) => EitherN<*>][]}
   */
  const validatorPairs = [["success", anonymousValidator1006701760]];
  for (const [key, validator] of validatorPairs) {
    const validatorResult = validator(value[key], `${propertyPath}.${key}`);
    if (validatorResult.errors) {
      errors.push(...validatorResult.errors);
    } else {
      result[key] = validatorResult.value;
    }
  }
  if (errors.length > 0) {
    return { errors };
  }
  return { value: result };
}
/**
 * @param {*} value
 * @param {string} propertyPath
 * @returns {EitherN<{"task": string, "metadata": {"tags": (string)[], "isUrgent": boolean, }, }>}
 */
export function anonymousValidator366487642(value, propertyPath) {
  if (isNil(value)) {
    /** @type {{ errors: InternalError[] }} */
    return {
      errors: [
        {
          propertyPath,
          key: "validator.object.undefined",
          info: {},
        },
      ],
    };
  }
  if (typeof value !== "object") {
    /** @type {{ errors: InternalError[] }} */
    return {
      errors: [
        {
          propertyPath,
          key: "validator.object.type",
          info: {},
        },
      ],
    };
  }
  const result = Object.create(null);
  let errors = [];
  for (const key of Object.keys(value)) {
    if (!objectKeys366487642.has(key)) {
      /** @type {{ errors: InternalError[] }} */
      return {
        errors: [
          {
            propertyPath,
            key: "validator.object.strict",
            info: { extraKey: key },
          },
        ],
      };
    }
  }
  /**
   * @type {[string, (value: *, propertyPath: string) => EitherN<*>][]}
   */
  const validatorPairs = [
    ["task", anonymousValidator186795873],
    ["metadata", anonymousValidator1814910903],
  ];
  for (const [key, validator] of validatorPairs) {
    const validatorResult = validator(value[key], `${propertyPath}.${key}`);
    if (validatorResult.errors) {
      errors.push(...validatorResult.errors);
    } else {
      result[key] = validatorResult.value;
    }
  }
  if (errors.length > 0) {
    return { errors };
  }
  return { value: result };
}
/**
 * @param {*} value
 * @param {string} propertyPath
 * @returns {EitherN<(TodoItem)[]>}
 */
export function anonymousValidator1654927553(value, propertyPath) {
  if (isNil(value)) {
    /** @type {{ errors: InternalError[] }} */
    return {
      errors: [
        {
          propertyPath,
          key: "validator.array.undefined",
          info: {},
        },
      ],
    };
  }
  if (!Array.isArray(value)) {
    /** @type {{ errors: InternalError[] }} */
    return {
      errors: [
        {
          propertyPath,
          key: "validator.array.type",
          info: {},
        },
      ],
    };
  }
  const result = Array.from({ length: value.length });
  let errors = [];
  for (let i = 0; i < value.length; ++i) {
    const arrVar = anonymousValidator1231411047(
      value[i],
      propertyPath + "[" + i + "]",
    );
    if (arrVar.errors) {
      errors.push(...arrVar.errors);
    } else {
      result[i] = arrVar.value;
    }
  }
  if (errors.length > 0) {
    /** @type {{ errors: InternalError[] }} */
    return { errors };
  }
  return { value: result };
}
/**
 * @param {*} value
 * @param {string} propertyPath
 * @returns {EitherN<{"todos": (TodoItem)[], }>}
 */
export function anonymousValidator712084859(value, propertyPath) {
  if (isNil(value)) {
    /** @type {{ errors: InternalError[] }} */
    return {
      errors: [
        {
          propertyPath,
          key: "validator.object.undefined",
          info: {},
        },
      ],
    };
  }
  if (typeof value !== "object") {
    /** @type {{ errors: InternalError[] }} */
    return {
      errors: [
        {
          propertyPath,
          key: "validator.object.type",
          info: {},
        },
      ],
    };
  }
  const result = Object.create(null);
  let errors = [];
  for (const key of Object.keys(value)) {
    if (!objectKeys712084859.has(key)) {
      /** @type {{ errors: InternalError[] }} */
      return {
        errors: [
          {
            propertyPath,
            key: "validator.object.strict",
            info: { extraKey: key },
          },
        ],
      };
    }
  }
  /**
   * @type {[string, (value: *, propertyPath: string) => EitherN<*>][]}
   */
  const validatorPairs = [["todos", anonymousValidator1654927553]];
  for (const [key, validator] of validatorPairs) {
    const validatorResult = validator(value[key], `${propertyPath}.${key}`);
    if (validatorResult.errors) {
      errors.push(...validatorResult.errors);
    } else {
      result[key] = validatorResult.value;
    }
  }
  if (errors.length > 0) {
    return { errors };
  }
  return { value: result };
}
/**
 * @param {*} value
 * @param {string} propertyPath
 * @returns {EitherN<{"id": string, }>}
 */
export function anonymousValidator248765300(value, propertyPath) {
  if (isNil(value)) {
    /** @type {{ errors: InternalError[] }} */
    return {
      errors: [
        {
          propertyPath,
          key: "validator.object.undefined",
          info: {},
        },
      ],
    };
  }
  if (typeof value !== "object") {
    /** @type {{ errors: InternalError[] }} */
    return {
      errors: [
        {
          propertyPath,
          key: "validator.object.type",
          info: {},
        },
      ],
    };
  }
  const result = Object.create(null);
  let errors = [];
  for (const key of Object.keys(value)) {
    if (!objectKeys248765300.has(key)) {
      /** @type {{ errors: InternalError[] }} */
      return {
        errors: [
          {
            propertyPath,
            key: "validator.object.strict",
            info: { extraKey: key },
          },
        ],
      };
    }
  }
  /**
   * @type {[string, (value: *, propertyPath: string) => EitherN<*>][]}
   */
  const validatorPairs = [["id", anonymousValidator56355924]];
  for (const [key, validator] of validatorPairs) {
    const validatorResult = validator(value[key], `${propertyPath}.${key}`);
    if (validatorResult.errors) {
      errors.push(...validatorResult.errors);
    } else {
      result[key] = validatorResult.value;
    }
  }
  if (errors.length > 0) {
    return { errors };
  }
  return { value: result };
}
/**
 * @param {*} value
 * @param {string} propertyPath
 * @returns {EitherN<{"todo": TodoItem, }>}
 */
export function anonymousValidator1328493231(value, propertyPath) {
  if (isNil(value)) {
    /** @type {{ errors: InternalError[] }} */
    return {
      errors: [
        {
          propertyPath,
          key: "validator.object.undefined",
          info: {},
        },
      ],
    };
  }
  if (typeof value !== "object") {
    /** @type {{ errors: InternalError[] }} */
    return {
      errors: [
        {
          propertyPath,
          key: "validator.object.type",
          info: {},
        },
      ],
    };
  }
  const result = Object.create(null);
  let errors = [];
  for (const key of Object.keys(value)) {
    if (!objectKeys1328493231.has(key)) {
      /** @type {{ errors: InternalError[] }} */
      return {
        errors: [
          {
            propertyPath,
            key: "validator.object.strict",
            info: { extraKey: key },
          },
        ],
      };
    }
  }
  /**
   * @type {[string, (value: *, propertyPath: string) => EitherN<*>][]}
   */
  const validatorPairs = [["todo", anonymousValidator40283585]];
  for (const [key, validator] of validatorPairs) {
    const validatorResult = validator(value[key], `${propertyPath}.${key}`);
    if (validatorResult.errors) {
      errors.push(...validatorResult.errors);
    } else {
      result[key] = validatorResult.value;
    }
  }
  if (errors.length > 0) {
    return { errors };
  }
  return { value: result };
}
