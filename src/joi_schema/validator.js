// @flow

import type {
  IValidator,
  ValidateResult,
} from '../type';

const Joi = require('joi');

/**
 * A Joi validator's wrapper
 *
 * @class RequestHandler
 * @implements {IValidator}
 */
class RequestHandler implements IValidator {
  joiValidator: any;
  joiOption: Object;
  constructor(schema: Object, joiOption: Object): void {
    this.joiValidator = Joi.compile(schema);
    this.joiOption = joiOption;
  }
  /**
   * validate the data via joi
   *
   * @param {Object} requestData
   * @returns {ValidateResult}
   * @memberof RequestHandler
   */
  validate(requestData: Object): ValidateResult {
    return this.joiValidator.validate(requestData, this.joiOption);
  }
}

module.exports = RequestHandler;
