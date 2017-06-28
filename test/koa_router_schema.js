const test = require('ava');
const KoaRouterSchema = require('../lib/koa_router_schema');
const Router = require('koa-router');

test('RouterSchema.property.loadSchema()', (t) => {
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

test('RouterSchema.property.handler() with validate success case', (t) => {
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

test('RouterSchema.property.handler() with validate failure case', (t) => {
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

