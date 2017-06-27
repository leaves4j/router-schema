const Joi = require('joi');
const test = require('ava');
const Validator = require('../lib/joi_schema/validator');

test('Validator.constructor()', (t) => {
  const validator = new Validator({ test: Joi.string() }, { allowUnknown: true });
  const requestData = { test: 'a', m: 'b' };
  const { error, value } = validator.validate(requestData);
  t.is(error, null);
  t.deepEqual(value, requestData);
});


test('Validator.prototype.validate()', (t) => {
  const validator = new Validator({ test: Joi.string() });
  const { error, value } = validator.validate({ test: 'a' });
  t.is(error, null);
  t.deepEqual(value, { test: 'a' });
});
