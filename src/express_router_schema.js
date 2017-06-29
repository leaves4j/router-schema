// @flow

import type { $Request, $Response, NextFunction } from 'express';
import type { RouterSchemaOption, ValidateData } from './type';

const RouterSchema = require('./router_schema');
const utils = require('./utils');

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
    const hasQuery: boolean = !utils.isEmptyObject(req.query);
    const hasBody: boolean = !utils.isEmptyObject(req.body);

    const data: Object = {};
    if (hasQuery) data.query = req.query;
    if (hasBody) data.body = req.body;

    const callback = (error: null | Error, value: Object | null) => {
      if (error) {
        return next(error);
      }
      if (value) {
        if (hasQuery) req.query = value.query;
        if (hasBody) req.body = value.body;
      }

      return next();
    };
    return { data, callback };
  }
}

module.exports = ExpressRouterSchema;
