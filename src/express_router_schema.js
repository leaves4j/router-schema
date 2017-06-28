// @flow

import type { $Request, $Response, NextFunction } from 'express';
import type { RouterSchemaOption, ValidateData } from './type';


const RouterSchema = require('./router_schema');

/**
 * ExpressRouterSchema
 *
 * @class ExpressRouterSchema
 * @extends {RouterSchema}
 */
class ExpressRouterSchema extends RouterSchema {
  constructor(option: RouterSchemaOption) {
    super(option);
  }
  /**
   * Implement RouterSchema.handler()
   *
   * @override
   * @param {$Request} req
   * @param {$Response} res
   * @param {NextFunction} next
   * @returns {ValidateData}
   * @memberof ExpressRouterSchema
   */
  handler(req: $Request, res: $Response, next: (error?: Error) => void): ValidateData {
    if (this.options.handler) {
      return this.options.handler(req, res, next);
    }
    const { query, body } = req;
    const callback = (error: null | Error, value: Object | null) => {
      if (error) {
        return next(error);
      }
      if (value) {
        req.query = value.query;
        req.body = value.body;
      }

      return next();
    };
    return { data: { query, body }, callback };
  }
}

module.exports = ExpressRouterSchema;
