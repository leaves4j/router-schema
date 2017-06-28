const test = require('ava');
const ExpressJoiSchema = require('../lib/express_joi_schema');
const { Router } = require('express');

test('JoiSchema.property.loadSchema()', (t) => {
  const requestSchema = {
    'GET /foo/bar': {
      query: {
        hello: 'world',
      },
    },
    '/bar/foo': {
      body: {
        hello: 'world',
      },
    },
  };
  const joiSchema = new ExpressJoiSchema();
  const router = new Router();
  const schemaRouter = joiSchema.loadSchema(router, requestSchema);
  t.deepEqual(schemaRouter, router);
  t.is(router.stack.length, 2);

  t.is(router.stack[0].route.path, '/foo/bar');
  t.is(router.stack[0].route.stack[0].method, 'get');
  t.is(router.stack[1].route.path, '/bar/foo');
  t.is(router.stack[1].route.stack[0].method, undefined);
});

test('JoiSchema.property.handler() with validate success case', (t) => {
  const expressJoiSchema = new ExpressJoiSchema();

  const req = {
    query: {
      hello: 'world',
      hello1: 'wor!d',
    },
    body: {
      hello: 'world1',
    },
  };
  const next = (error) => {
    t.is(error, undefined);
  };

  const { data, callback } = expressJoiSchema.handler(req, {}, next);
  t.deepEqual(data, {
    query: {
      hello: 'world',
      hello1: 'wor!d',
    },
    body: {
      hello: 'world1',
    },
  });
  callback(null, {
    query: {
      hello: 'world',
    },
    body: {
      hello: 'world2',
    },
  });
  t.deepEqual(req.query, {
    hello: 'world',
  });
  t.deepEqual(req.body, {
    hello: 'world2',
  });
});

test('JoiSchema.property.handler() with validate failure case', (t) => {
  const expressJoiSchema = new ExpressJoiSchema();

  const req = {
    query: {
      hello: 'world',
      hello1: 'wor!d',
    },
    body: {
      hello: 'world1',
    },
  };
  const validateError = new Error('validate fail');

  const next = (error) => {
    t.is(error, validateError);
  };

  const { data, callback } = expressJoiSchema.handler(req, {}, next);
  t.deepEqual(data, {
    query: {
      hello: 'world',
      hello1: 'wor!d',
    },
    body: {
      hello: 'world1',
    },
  });
  callback(validateError, {
    query: {
      hello: 'world',
    },
    body: {
      hello: 'world2',
    },
  });
  t.deepEqual(req.query, {
    hello: 'world',
    hello1: 'wor!d',
  });
  t.deepEqual(req.body, {
    hello: 'world1',
  });
});

