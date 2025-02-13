// Generated by @compas/code-gen
/* eslint-disable no-unused-vars */

import {
  anonymousValidator293130468,
  anonymousValidator80886428,
} from "../common/anonymous-validators.js";
import { AppError, isNil } from "@compas/stdlib";
/**
 * @template T
 * @typedef {import("@compas/stdlib").Either<T, AppError>} Either
 */
/**
 * @param {undefined|any|CompasOrderByInput} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<CompasOrderBy>}
 */
export function validateCompasOrderBy(value, propertyPath = "$") {
  const result = anonymousValidator80886428(value, propertyPath);
  if (result.errors) {
    const info = {};
    for (const err of result.errors) {
      if (isNil(info[err.propertyPath])) {
        info[err.propertyPath] = err;
      } else if (Array.isArray(info[err.propertyPath])) {
        info[err.propertyPath].push(err);
      } else {
        info[err.propertyPath] = [info[err.propertyPath], err];
      }
    }
    /** @type {{ error: AppError }} */
    return {
      error: AppError.validationError("validator.error", info),
    };
  }
  /** @type {{ value: CompasOrderBy}} */
  return { value: result.value };
}
/**
 * @param {undefined|any|CompasOrderByOptionalInput} value
 * @param {string|undefined} [propertyPath]
 * @returns {Either<CompasOrderByOptional>}
 */
export function validateCompasOrderByOptional(value, propertyPath = "$") {
  const result = anonymousValidator293130468(value, propertyPath);
  if (result.errors) {
    const info = {};
    for (const err of result.errors) {
      if (isNil(info[err.propertyPath])) {
        info[err.propertyPath] = err;
      } else if (Array.isArray(info[err.propertyPath])) {
        info[err.propertyPath].push(err);
      } else {
        info[err.propertyPath] = [info[err.propertyPath], err];
      }
    }
    /** @type {{ error: AppError }} */
    return {
      error: AppError.validationError("validator.error", info),
    };
  }
  /** @type {{ value: CompasOrderByOptional}} */
  return { value: result.value };
}
