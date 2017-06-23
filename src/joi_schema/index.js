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

class JoiSchema implements IJoiSchema {
  options: JoiSchemaOption;
  constructor(options: JoiSchemaOption): void {
    this.options = options;
  }

  handler(...args: any): ValidateData {
    if (this.options.handler) {
      return this.options.handler(...args);
    }
    throw new Error('JoiSchema.handler() should be implemented');
  }

  loadSchema(router: any, schemaOption: SchemaOption): any {
    const routerSchemaList: Array<RouterSchema> = JoiSchema.schemaPraser(schemaOption);
    routerSchemaList.forEach((routerSchema: RouterSchema) => {
      const { method, path, schema } = routerSchema;
      const validator: Validator = new Validator(schema, this.options.joiOption);
      const requestHandler: RequestHandler = new RequestHandler(this.handler, validator);
      router[method.toLowerCase()](path, requestHandler.handler);
    });
    return router;
  }

  static schemaPraser(schemaOption): Array<RouterSchema> {
    return Object.keys(schemaOption).map((key: string) => {
      const keyArray: Array<string> = key.split(' ');
      let method: string = 'all';
      let path: string = '';
      if (keyArray.length > 1) {
        method = keyArray[0];
        path = keyArray[1];
      } else {
        path = keyArray[0];
      }
      return { method, path, schema: schemaOption[key] };
    });
  }


}
module.exports = JoiSchema;
