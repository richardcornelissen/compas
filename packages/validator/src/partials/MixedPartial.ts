import { Schema, SchemaBuilder, schemaBuildSymbol } from "../types";

export abstract class MixedPartial implements SchemaBuilder {
  protected _name?: string;
  protected _optional?: true;
  protected _withValidationHooks?: true;

  abstract [schemaBuildSymbol](): Schema;

  name(name: string): this {
    this._name = name;
    return this;
  }

  optional(): this {
    this._optional = true;
    return this;
  }

  withValidationHooks(): this {
    this._withValidationHooks = true;
    return this;
  }

  protected partialBuild() {
    return {
      name: this._name,
      optional: this._optional,
      withValidationHooks: this._withValidationHooks,
    };
  }
}
