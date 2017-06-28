// @flow

import type { Context } from 'koa';
import type { RouterSchemaOption, ValidateData } from './type';


const RouterSchema = require('./router_schema');
/**
 * KoaRouterSchema
 *
 * @class KoaRouterSchema
 * @extends {RouterSchema}
 */
class KoaRouterSchema extends RouterSchema {
  constructor(option: RouterSchemaOption) {
    super(option);
  }

 /**
   * Implement RouterSchema.handler()
   *
   * @override
   * @param {Context} ctx
   * @param {() => Promise<void>} next
   * @returns {ValidateData}
   * @memberof KoaRouterSchema
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

module.exports = KoaRouterSchema;
