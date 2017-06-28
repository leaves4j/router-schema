const Joi = require('joi');

const schema = {
  'GET /foo/bar': {
    query: {
      hello: Joi.string(),
    },
    body: {
      world: Joi.number().required(),
    },
  },
  '/bar/foo': {
    query: {
      hello: Joi.string(),
    },
    body: {
      world: Joi.number().required(),
    },
  },
};
module.exports = schema;
