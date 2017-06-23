// @flow

import type {
  IValidator,
  ValidateResult,
} from '../type';

const Joi = require('joi');

class RequestHandler implements IValidator {
  joiValidator: any;
  joiOption: Object;
  constructor(schema: Object, joiOption: Object): void {
    this.joiValidator = Joi.compile(schema);
    this.joiOption = joiOption;
  }
  vaildate(requestData: Object): ValidateResult {
    return this.joiValidator.vaildate(requestData, this.joiOption);
  }
}

module.exports = RequestHandler;
