// @flow

import type {
  IJoiSchema,
  SchemaOption,
  ValidateData,
  RouterSchema,
  JoiSchemaOption,
} from '../type';

const RequestHandler = require('./request_handler');
const Validator = require('./validator');

/**
 * JoiSchema Class
 *
 * @class JoiSchema
 * @implements {IJoiSchema}
 */
class JoiSchema implements IJoiSchema {
  options: JoiSchemaOption;
  constructor(options: JoiSchemaOption): void {
    this.options = options || { handler: null, joiOption: null };
  }

  /**
   * request convert, convert the request parameters
   *
   * @abstract
   * @param {...any} args
   * @returns {ValidateData}
   * @memberof JoiSchema
   */
  handler(...args: any): ValidateData {
    if (this.options.handler) {
      return this.options.handler(...args);
    }
    throw new Error('JoiSchema.handler() should be implemented');
  }
  /**
   * load schema, register request handler to router
   *
   * @param {*} router
   * @param {SchemaOption} schemaOption
   * @returns {*}
   * @memberof JoiSchema
   */

  loadSchema(router: any, schemaOption: SchemaOption): * {
    const routerSchemaList: Array<RouterSchema> = JoiSchema.SchemaParser(schemaOption);
    routerSchemaList.forEach((routerSchema: RouterSchema) => {
      const { method, path, schema } = routerSchema;
      const validator: Validator = new Validator(schema, this.options.joiOption);
      const requestHandler: RequestHandler = new RequestHandler(this.handler, validator);
      router[method](path, requestHandler.handler);
    });
    return router;
  }

  /**
   * parse schema
   *
   * @static
   * @param {SchemaOption} schemaOption
   * @returns {Array<RouterSchema>}
   * @memberof JoiSchema
   */
  static SchemaParser(schemaOption: SchemaOption): Array<RouterSchema> {
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
module.exports = JoiSchema;
