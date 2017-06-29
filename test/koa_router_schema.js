const test = require('ava');
const Router = require('koa-router');
const axios = require('axios');
const KoaRouterSchema = require('../lib/koa_router_schema');
const app = require('./helpers/koa_server');

test('KoaRouterSchema.property.loadSchema()', (t) => {
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
  const routerSchema = new KoaRouterSchema();
  const router = new Router();
  const schemaRouter = routerSchema.loadSchema(router, requestSchema);
  t.deepEqual(schemaRouter, router);
  t.is(router.stack.length, 2);
  t.is(router.stack[0].path, '/foo/bar');
  t.true(router.stack[0].methods.includes('GET'));
  t.is(router.stack[1].path, '/bar/foo');
  t.true(router.stack[1].methods.includes('GET'));
  t.true(router.stack[1].methods.includes('POST'));
  t.true(router.stack[1].methods.includes('PUT'));
});

test('KoaRouterSchema.property.handler() with validate success case', (t) => {
  const routerSchema = new KoaRouterSchema();

  const ctx = {
    query: {
      hello: 'world',
      hello1: 'wor!d',
    },
    request: {
      body: {
        hello: 'world1',
      },
    },
  };
  const next = (error) => {
    t.is(error, undefined);
    t.pass();
  };

  const { data, callback } = routerSchema.handler(ctx, next);
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
  t.deepEqual(ctx.query, {
    hello: 'world',
  });
  t.deepEqual(ctx.request.body, {
    hello: 'world2',
  });
});

test('KoaRouterSchema.property.handler() with validate failure case', (t) => {
  const routerSchema = new KoaRouterSchema();

  const ctx = {
    query: {
      hello: 'world',
      hello1: 'wor!d',
    },
    request: {
      body: {
        hello: 'world1',
      },
    },
  };
  const validateError = new Error('validate fail');

  const next = () => {
    t.fail();
  };

  const { data, callback } = routerSchema.handler(ctx, next);
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
  }).catch(e => t.is(e.message, 'validate fail'));
  t.deepEqual(ctx.query, {
    hello: 'world',
    hello1: 'wor!d',
  });
  t.deepEqual(ctx.request.body, {
    hello: 'world1',
  });
});

test('Koa server request', async (t) => {
  app.listen(8080);
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
