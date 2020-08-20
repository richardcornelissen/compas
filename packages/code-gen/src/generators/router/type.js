import { isNil } from "@lbu/stdlib";
import { TypeBuilder, TypeCreator } from "../../types/index.js";
import { buildOrInfer } from "../../types/TypeBuilder.js";
import { lowerCaseFirst } from "../../utils.js";

export class RouteBuilder extends TypeBuilder {
  constructor(method, group, name, path) {
    super("route", group, name);

    this.data.method = method;
    this.data.path = path;
    this.data.tags = [];

    this.queryBuilder = undefined;
    this.paramsBuilder = undefined;
    this.bodyBuilder = undefined;
    this.filesBuilder = undefined;
    this.responseBuilder = undefined;
  }

  /**
   * @param {string} values
   * @returns {RouteBuilder}
   */
  tags(...values) {
    for (const v of values) {
      this.data.tags.push(lowerCaseFirst(v));
    }

    return this;
  }

  /**
   * @param {TypeBuilderLike} builder
   * @returns {RouteBuilder}
   */
  query(builder) {
    this.queryBuilder = builder;

    return this;
  }

  /**
   * @param {TypeBuilderLike} builder
   * @returns {RouteBuilder}
   */
  params(builder) {
    this.paramsBuilder = builder;

    return this;
  }

  /**
   * @param {TypeBuilderLike} builder
   * @returns {RouteBuilder}
   */
  body(builder) {
    if (["POST", "PUT", "DELETE"].indexOf(this.data.method) === -1) {
      throw new Error("Can only use body on POST, PUT or DELETE routes");
    }

    this.bodyBuilder = builder;

    return this;
  }

  /**
   * @param {TypeBuilderLike} builder
   * @returns {RouteBuilder}
   */
  files(builder) {
    if (["POST", "PUT"].indexOf(this.data.method) === -1) {
      throw new Error("Can only use files on POST or PUT routes");
    }

    this.filesBuilder = builder;

    return this;
  }

  /**
   * @param {TypeBuilderLike} builder
   * @returns {RouteBuilder}
   */
  response(builder) {
    this.responseBuilder = builder;

    return this;
  }

  build() {
    const result = super.build();

    if (this.bodyBuilder && this.filesBuilder) {
      throw new Error(
        `Route ${result.group} - ${result.name} can't have both body and files.`,
      );
    }

    if (this.queryBuilder) {
      result.query = buildOrInfer(this.queryBuilder);

      if (isNil(result.query.name)) {
        result.query.group = result.group;
        result.query.name = `${result.name}Query`;
      }
    }

    if (this.paramsBuilder) {
      result.params = buildOrInfer(this.paramsBuilder);

      if (isNil(result.params.name)) {
        result.params.group = result.group;
        result.params.name = `${result.name}Params`;
      }
    }

    if (this.bodyBuilder) {
      result.body = buildOrInfer(this.bodyBuilder);

      if (isNil(result.body.name)) {
        result.body.group = result.group;
        result.body.name = `${result.name}Body`;
      }
    }

    if (this.filesBuilder) {
      result.files = buildOrInfer(this.filesBuilder);

      if (isNil(result.files.name)) {
        result.files.group = result.group;
        result.files.name = `${result.name}Files`;
      }
    }

    if (this.responseBuilder) {
      result.response = buildOrInfer(this.responseBuilder);

      if (isNil(result.response.name)) {
        result.response.group = result.group;
        result.response.name = `${result.name}Response`;
      }
    }

    if (result.path.indexOf(":") !== -1 && result.params === undefined) {
      // Looks like there is a path param but no definition for it
      result.params = createParamsFromPath(
        result.group,
        `${result.name}Params`,
        result.path,
      );
    }

    return result;
  }
}

/**
 * Build an object for route params if the user forgot to do that
 * @param {string} group
 * @param {string} name
 * @param {string} path
 * @returns {object}
 */
function createParamsFromPath(group, name, path) {
  const T = new TypeCreator(group);
  const obj = T.object(name);
  const keys = {};

  for (const part of path.split("/")) {
    if (part.startsWith(":")) {
      keys[part.substring(1)] = T.string();
    }
  }

  return buildOrInfer(obj.keys(keys));
}

class RouteCreator {
  constructor(group, path) {
    this.data = {
      group,
      path,
    };

    if (this.data.path.startsWith("/")) {
      this.data.path = this.data.path.slice(1);
    }
  }

  /**
   * @param {string} name
   * @param {string} path
   * @returns {RouteCreator}
   */
  group(name, path) {
    return new RouteCreator(name, concatenateRoutePaths(this.data.path, path));
  }

  /**
   * @param {string} [path]
   * @param {string} [name]
   * @returns {RouteBuilder}
   */
  get(path, name) {
    return new RouteBuilder(
      "GET",
      this.data.group,
      name || "get",
      concatenateRoutePaths(this.data.path, path || "/"),
    );
  }

  /**
   * @param {string} [path]
   * @param {string} [name]
   * @returns {RouteBuilder}
   */
  post(path, name) {
    return new RouteBuilder(
      "POST",
      this.data.group,
      name || "post",
      concatenateRoutePaths(this.data.path, path || "/"),
    );
  }

  /**
   * @param {string} [path]
   * @param {string} [name]
   * @returns {RouteBuilder}
   */
  put(path, name) {
    return new RouteBuilder(
      "PUT",
      this.data.group,
      name || "put",
      concatenateRoutePaths(this.data.path, path || "/"),
    );
  }

  /**
   * @param {string} [path]
   * @param {string} [name]
   * @returns {RouteBuilder}
   */
  delete(path, name) {
    return new RouteBuilder(
      "DELETE",
      this.data.group,
      name || "delete",
      concatenateRoutePaths(this.data.path, path || "/"),
    );
  }

  /**
   * @param {string} [path]
   * @param {string} [name]
   * @returns {RouteBuilder}
   */
  head(path, name) {
    return new RouteBuilder(
      "HEAD",
      this.data.group,
      name || "get",
      concatenateRoutePaths(this.data.path, path || "/"),
    );
  }
}

const routeType = {
  name: "route",
  class: {
    Builder: RouteBuilder,
    Creator: RouteCreator,
  },
};

/**
 * @name TypeCreator#router
 * @param {string} path
 * @returns {RouteCreator}
 */
TypeCreator.prototype.router = function (path) {
  return new RouteCreator(this.group, path);
};

TypeCreator.types.set(routeType.name, routeType);

/**
 * @param {string} path1
 * @param {string} path2
 * @returns {string}
 */
function concatenateRoutePaths(path1, path2) {
  if (!path1.endsWith("/")) {
    path1 += "/";
  }
  if (path2.startsWith("/")) {
    path2 = path2.substring(1);
  }

  return path1 + path2;
}
