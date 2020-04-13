import { merge } from "@lbu/stdlib";
import { M } from "../model/index.js";

const validatorDefaults = {
  boolean: {
    convert: false,
  },
  number: {
    convert: false,
    integer: false,
    min: undefined,
    max: undefined,
  },
  string: {
    convert: false,
    trim: false,
    lowerCase: false,
    upperCase: false,
    min: undefined,
    max: undefined,
    pattern: undefined,
  },
  object: {
    strict: false,
  },
  array: {
    convert: false,
    min: undefined,
    max: undefined,
  },
  anyOf: {},
  reference: {},
  generic: {},
  any: {},
};

export function decorateModels() {
  /**
   * Add the default validator object for the appropriate Lbu Type
   */
  function checkHasValidatorObject(instance) {
    if (!instance.data.validator) {
      instance.data.validator = merge(
        {},
        validatorDefaults[instance.data.type],
      );
    }
  }

  /**
   * @name LbuBool#convert
   * @function
   * @return {LbuBool}
   */
  M.types.LbuBool.prototype.convert = function () {
    checkHasValidatorObject(this);
    this.data.validator.convert = true;

    return this;
  };

  /**
   * @name LbuNumber#convert
   * @function
   * @return {LbuNumber}
   */
  M.types.LbuNumber.prototype.convert = function () {
    checkHasValidatorObject(this);
    this.data.validator.convert = true;

    return this;
  };

  /**
   * @name LbuNumber#integer
   * @function
   * @return {LbuNumber}
   */
  M.types.LbuNumber.prototype.integer = function () {
    checkHasValidatorObject(this);
    this.data.validator.integer = true;

    return this;
  };

  /**
   * @name LbuNumber#min
   * @function
   * @param {number} min
   * @return {LbuNumber}
   */
  M.types.LbuNumber.prototype.min = function (min) {
    checkHasValidatorObject(this);
    this.data.validator.min = min;

    return this;
  };

  /**
   * @name LbuNumber#max
   * @function
   * @param {number} max
   * @return {LbuNumber}
   */
  M.types.LbuNumber.prototype.max = function (max) {
    checkHasValidatorObject(this);
    this.data.validator.max = max;

    return this;
  };

  /**
   * @name LbuString#convert
   * @function
   * @return {LbuString}
   */
  M.types.LbuString.prototype.convert = function () {
    checkHasValidatorObject(this);
    this.data.validator.convert = true;

    return this;
  };

  /**
   * @name LbuString#trim
   * @function
   * @return {LbuString}
   */
  M.types.LbuString.prototype.trim = function () {
    checkHasValidatorObject(this);
    this.data.validator.trim = true;

    return this;
  };

  /**
   * @name LbuString#upperCase
   * @function
   * @return {LbuString}
   */
  M.types.LbuString.prototype.upperCase = function () {
    checkHasValidatorObject(this);
    this.data.validator.upperCase = true;

    return this;
  };

  /**
   * @name LbuString#lowerCase
   * @function
   * @return {LbuString}
   */
  M.types.LbuString.prototype.lowerCase = function () {
    checkHasValidatorObject(this);
    this.data.validator.lowerCase = true;

    return this;
  };

  /**
   * @name LbuString#min
   * @function
   * @param {number} min
   * @return {LbuString}
   */
  M.types.LbuString.prototype.min = function (min) {
    checkHasValidatorObject(this);
    this.data.validator.min = min;

    return this;
  };

  /**
   * @name LbuString#max
   * @function
   * @param {number} max
   * @return {LbuString}
   */
  M.types.LbuString.prototype.max = function (max) {
    checkHasValidatorObject(this);
    this.data.validator.max = max;

    return this;
  };

  /**
   * @name LbuString#pattern
   * @function
   * @param {RegExp} pattern
   * @return {LbuString}
   */
  M.types.LbuString.prototype.pattern = function (pattern) {
    checkHasValidatorObject(this);
    this.data.validator.pattern = pattern;

    return this;
  };

  /**
   * @name LbuObject#strict
   * @function
   * @return {LbuObject}
   */
  M.types.LbuObject.prototype.strict = function () {
    checkHasValidatorObject(this);
    this.data.validator.strict = true;

    return this;
  };

  /**
   * @name LbuArray#convert
   * @function
   * @return {LbuArray}
   */
  M.types.LbuArray.prototype.convert = function () {
    checkHasValidatorObject(this);
    this.data.validator.convert = true;

    return this;
  };

  /**
   * @name LbuArray#min
   * @function
   * @param {number} min
   * @return {LbuArray}
   */
  M.types.LbuArray.prototype.min = function (min) {
    checkHasValidatorObject(this);
    this.data.validator.min = min;

    return this;
  };

  /**
   * @name LbuArray#max
   * @function
   * @param {number} max
   * @return {LbuArray}
   */
  M.types.LbuArray.prototype.max = function (max) {
    checkHasValidatorObject(this);
    this.data.validator.max = max;

    return this;
  };
}
