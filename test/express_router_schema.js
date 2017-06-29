const test = require('ava');
const ExpressRouterSchema = require('../lib/express_router_schema');
const { Router } = require('express');
const axios = require('axios');
const app = require('./helpers/express_server');

test('ExpressRouterSchema.property.loadSchema()', (t) => {
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
  const routerSchema = new ExpressRouterSchema();
  const router = new Router();
  const schemaRouter = routerSchema.loadSchema(router, requestSchema);
  t.deepEqual(schemaRouter, router);
  t.is(router.stack.length, 2);

  t.is(router.stack[0].route.path, '/foo/bar');
  t.is(router.stack[0].route.stack[0].method, 'get');
  t.is(router.stack[1].route.path, '/bar/foo');
  t.is(router.stack[1].route.stack[0].method, undefined);
});

test('ExpressRouterSchema.property.handler() with validate success case', (t) => {
  const expressRouterSchema = new ExpressRouterSchema();

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

  const { data, callback } = expressRouterSchema.handler(req, {}, next);
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

test('ExpressRouterSchema.property.handler() with validate failure case', (t) => {
  const expressRouterSchema = new ExpressRouterSchema();

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

  const { data, callback } = expressRouterSchema.handler(req, {}, next);
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

test('Express server request', async (t) => {
  app.listen(8081);
  try {
    const result = await Promise.all([
      axios.get('http://localhost:8081/foo/bar?hello=world'),
      axios.post('http://localhost:8081/foo/bar', { world: 'hello' }),
      axios.post('http://localhost:8081/foo/bar', { world: 123 }),
    ]);
    t.is(result[0].data.hello, 'world');
    t.is(result[1].data.details[0].message, '"world" must be a number');
    t.is(result[2].data.hello, 'world');
  } catch (e) {
    t.fail(e);
  }
});

