// @flow

import type { Context } from 'koa';
import type { JoiSchemaOption, ValidateData } from './type';


const JoiSchema = require('./joi_schema');

class ExpressJoiSchema extends JoiSchema {
  constructor(option: JoiSchemaOption) {
    super(option);
  }
  handler(ctx: Context, next: () => Promise<void>): ValidateData {
    if (this.options.handler) {
      return this.options.handler(ctx, next);
    }
    const { query } = ctx;
    const { body } = ctx.state.body;
    const callback = (error: null | Object, value: Object | null) => {
      if (error) {
        throw error;
      }
      if (value) {
        ctx.query = value.query;
        ctx.body = value.body;
      }

      return next();
    };
    return { data: { query, body }, callback };
  }
}

module.exports = ExpressJoiSchema;
