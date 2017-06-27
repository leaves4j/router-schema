const Joi = require('joi');
const test = require('ava');
const RequestHandler = require('../lib/joi_schema/request_handler');
const Validator = require('../lib/joi_schema/validator');

test('RequestHandler.prototype.handler()', (t) => {
  const requestData = { test: 'a' };
  const convert = (ctx) => {
    const { query } = ctx;
    return {
      data: { query },
      callback: (error, value) => {
        t.is(error, null);
        t.deepEqual(value, { query: requestData });
      },
    };
  };
  const validator = new Validator({ query: { test: Joi.string() } });
  const requestHandler = new RequestHandler(convert, validator);
  const ctx = { query: requestData };
  requestHandler.handler(ctx);
});

