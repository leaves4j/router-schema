// @flow

import type {
  IRequestHandler,
  Convert,
  IValidator,
} from '../type';

class RequestHandler implements IRequestHandler {
  validator: IValidator;
  convert: Convert;
  constructor(convert: Convert, validator: IValidator): void {
    this.validator = validator;
    this.convert = convert;
  }
  handler(...args: any): Promise<void> {
    const { data, callback } = this.convert(...args);
    const { error, value } = this.validator.vaildate(data);
    return callback(error, value);
  }
}

module.exports = RequestHandler;
