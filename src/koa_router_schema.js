// @flow

import type { Context } from 'koa';
import type { RouterSchemaOption, ValidateData } from './type';

const RouterSchema = require('./router_schema');
const utils = require('./utils');
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
    const hasQuery: boolean = !utils.isEmptyObject(ctx.query);
    const hasBody: boolean = !utils.isEmptyObject(ctx.request.body);

    const data: Object = {};
    if (hasQuery) data.query = ctx.query;
    if (hasBody) data.body = ctx.request.body;

    const callback = (error: null | Object, value: Object | null) => {
      if (error) {
        return Promise.reject(error);
      }

      if (value) {
        if (hasQuery) ctx.query = value.query;
        if (hasBody) ctx.request.body = value.body;
      }

      return next();
    };

    return { data, callback };
  }
}

module.exports = KoaRouterSchema;
