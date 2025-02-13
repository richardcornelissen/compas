/**
 * @template {any[]} Args
 *
 * @param {Record<keyof import("../generated/common/types.js").CodeGenCrudType["routeOptions"], (...args:
 *   Args) => void>} functions
 * @param {import("../generated/common/types.js").CodeGenCrudType} type
 * @param {Args} args
 */
import { upperCaseFirst } from "../utils.js";

export function crudCallFunctionsForRoutes(functions, type, args) {
  if (type.routeOptions.listRoute) {
    functions.listRoute(...args);
  }

  if (type.routeOptions.singleRoute) {
    functions.singleRoute(...args);
  }

  if (type.routeOptions.createRoute) {
    functions.createRoute(...args);
  }

  if (type.routeOptions.updateRoute) {
    functions.updateRoute(...args);
  }

  if (type.routeOptions.deleteRoute) {
    functions.deleteRoute(...args);
  }
}

/**
 *
 * @param {import("../generated/common/types.js").CodeGenCrudType} type
 * @returns {string}
 */
export function crudCreateRouteParam(type) {
  return `${
    // @ts-expect-error
    type.fromParent?.options?.name ?? type.entity.reference.name
  }${
    // @ts-expect-error
    upperCaseFirst(type.internalSettings.primaryKey.key)
  }`;
}
