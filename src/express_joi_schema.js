// @flow

import type { $Request, $Response, NextFunction } from 'express';
import type { JoiSchemaOption, ValidateData } from './type';


const JoiSchema = require('./joi_schema');

class ExpressJoiSchema extends JoiSchema {
  constructor(option: JoiSchemaOption) {
    super(option);
  }
  handler(req: $Request, res: $Response, next: NextFunction): ValidateData {
    if (this.options.handler) {
      return this.options.handler(req, res, next);
    }
    const { query, body } = req;
    const callback = (error: null | Object, value: Object | null) => {
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

module.exports = ExpressJoiSchema;
