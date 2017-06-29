// @flow

import type {
  IRequestHandler,
  Convert,
  IValidator,
} from '../type';

/**
 * RequestHandler
 *
 * @class RequestHandler
 * @implements {IRequestHandler}
 */
class RequestHandler implements IRequestHandler {
  validator: IValidator;
  convert: Convert;
  constructor(convert: Convert, validator: IValidator): void {
    this.validator = validator;
    this.convert = convert;
  }
  /**
   * handle the request, will be registered to the router
   *
   * @param {...Array<any>} args
   * @returns {Promise<void>}
   * @memberof RequestHandler
   */
  handler(...args: Array<any>): Promise<void> | void {
    const { data, callback } = this.convert(...args);
    const { error, value } = this.validator.validate(data);
    return callback(error, value);
  }
}

module.exports = RequestHandler;
