// Generated by @compas/code-gen
/* eslint-disable no-unused-vars */

import { AppError } from "@compas/stdlib";
/**
 * @type { {
 * structure: (CompasStructureFn|CompasStructureFn[]),
 * } }
 */
export const compasHandlers = {
  /**
   * GET _compas/structure.json
   * Return the full generated structure as a json object.
   *
   * Tags: _compas
   */
  structure: (ctx, next) => {
    throw AppError.notImplemented();
  },
};

export const compasTags = {
  structure: ["_compas"],
};
