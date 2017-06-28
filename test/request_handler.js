const Joi = require('joi');
const test = require('ava');
const RequestHandler = require('../lib/joi_schema/request_handler');
const Validator = require('../lib/joi_schema/validator');

test('RequestHandler.prototype.handler() with validate success case', (t) => {
  const validator = new Validator({ query: { test: Joi.string() } });

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
  const requestHandler = new RequestHandler(convert, validator);
  const requestCtx = { query: requestData };
  requestHandler.handler(requestCtx);
});

test('RequestHandler.prototype.handler() with validate failure case', (t) => {
  const validator = new Validator({ query: { test: Joi.string() } });

  const errorRequestData = { test: 1 };
  const errorConvert = (ctx) => {
    const { query } = ctx;
    return {
      data: { query },
      callback: (error) => {
        t.not(error, null);
      },
    };
  };

  const errorRequestHandler = new RequestHandler(errorConvert, validator);
  const ctx = { query: errorRequestData };
  errorRequestHandler.handler(ctx);
});

test('RequestHandler.prototype.handler() with validate failure case', (t) => {
  const validator = new Validator({ query: { test: Joi.string() } });

  const errorRequestData = { test: 1 };
  const errorConvert = (ctx) => {
    const { query } = ctx;
    return {
      data: { query },
      callback: (error) => {
        t.not(error, null);
      },
    };
  };

  const errorRequestHandler = new RequestHandler(errorConvert, validator);
  const ctx = { query: errorRequestData };
  errorRequestHandler.handler(ctx);
});

test('RequestHandler.prototype.handler() callback return', (t) => {
  const validator = new Validator({ query: { test: Joi.string() } });

  const errorRequestData = { test: 1 };
  const errorConvert = (ctx) => {
    const { query } = ctx;
    return {
      data: { query },
      callback: () => 'hello world',
    };
  };

  const errorRequestHandler = new RequestHandler(errorConvert, validator);
  const ctx = { query: errorRequestData };
  t.is(errorRequestHandler.handler(ctx), 'hello world');
});

