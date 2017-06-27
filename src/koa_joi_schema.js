// @flow

import type { Context } from 'koa';
import type { JoiSchemaOption, ValidateData } from './type';


const JoiSchema = require('./joi_schema');
/**
 * ExpressJoiSchema
 *
 * @class ExpressJoiSchema
 * @extends {JoiSchema}
 */
class ExpressJoiSchema extends JoiSchema {
  constructor(option: JoiSchemaOption) {
    super(option);
  }

 /**
   * Implement JoiSchema.handler()
   *
   * @override
   * @param {Context} ctx
   * @param {() => Promise<void>} next
   * @returns {ValidateData}
   * @memberof ExpressJoiSchema
   */
  handler(ctx: Context, next: () => Promise<void>): ValidateData {
    if (this.options.handler) {
      return this.options.handler(ctx, next);
    }
    const { query } = ctx;
    const { body } = ctx.request;
    const callback = (error: null | Object, value: Object | null) => {
      if (error) {
        return Promise.reject(error);
      }
      if (value) {
        ctx.query = value.query;
        ctx.request.body = value.body;
      }

      return next();
    };
    return { data: { query, body }, callback };
  }
}

module.exports = ExpressJoiSchema;
