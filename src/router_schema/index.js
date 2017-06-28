// @flow

import type {
  IRouterSchema,
  SchemaOption,
  ValidateData,
  RouterSchemaObject,
  RouterSchemaOption,
} from '../type';

const RequestHandler = require('./request_handler');
const Validator = require('./validator');

/**
 * RouterSchema Class
 *
 * @class RouterSchema
 * @implements {IRouterSchema}
 */
class RouterSchema implements IRouterSchema {
  options: RouterSchemaOption;
  constructor(options: RouterSchemaOption): void {
    this.options = options || { handler: null, joiOption: null };
  }

  /**
   * request convert, convert the request parameters
   *
   * @abstract
   * @param {...any} args
   * @returns {ValidateData}
   * @memberof RouterSchema
   */
  handler(...args: any): ValidateData {
    if (this.options.handler) {
      return this.options.handler(...args);
    }
    throw new Error('RouterSchema.handler() should be implemented');
  }
  /**
   * load schema, register request handler to router
   *
   * @param {*} router
   * @param {SchemaOption} schemaOption
   * @returns {*}
   * @memberof RouterSchema
   */

  loadSchema(router: any, schemaOption: SchemaOption): * {
    const routerSchemaObjectList: Array<RouterSchemaObject> = RouterSchema.SchemaParser(schemaOption);
    routerSchemaObjectList.forEach((routerSchemaObject: RouterSchemaObject) => {
      const { method, path, schema } = routerSchemaObject;
      const validator: Validator = new Validator(schema, this.options.joiOption);
      const requestHandler: RequestHandler = new RequestHandler(this.handler, validator);
      router[method](path, requestHandler.handler.bind(requestHandler));
    });
    return router;
  }

  /**
   * parse schema
   *
   * @static
   * @param {SchemaOption} schemaOption
   * @returns {Array<RouterSchema>}
   * @memberof RouterSchema
   */
  static SchemaParser(schemaOption: SchemaOption): Array<RouterSchemaObject> {
    return Object.keys(schemaOption).map((key: string) => {
      const keyArray: Array<string> = key.split(' ');
      let method: string = 'all';
      let path: string = '';
      if (keyArray.length > 1) {
        method = keyArray[0].toLowerCase();
        path = keyArray[1];
      } else {
        path = keyArray[0];
      }
      return { method, path, schema: schemaOption[key] };
    });
  }


}
module.exports = RouterSchema;
