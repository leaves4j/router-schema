const test = require('ava');
const RouterSchema = require('../lib/router_schema');

test('RouterSchema.SchemaParser()', (t) => {
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
  const routerSchema = RouterSchema.SchemaParser(requestSchema);
  t.is(routerSchema.length, 2);
  t.deepEqual(routerSchema[0], {
    method: 'get',
    path: '/foo/bar',
    schema: {
      query: {
        hello: 'world',
      },
    },
  });
  t.deepEqual(routerSchema[1], {
    method: 'all',
    path: '/bar/foo',
    schema: {
      body: {
        hello: 'world',
      },
    },
  });
});

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
  const stack = [];
  const router = {
    get(path, handle) {
      stack.push({ method: 'get', path, handle });
    },
    all(path, handle) {
      stack.push({ method: 'all', path, handle });
    },
  };
  const routerSchema = new RouterSchema(router);

  const schemaRouter = routerSchema.loadSchema(requestSchema);
  t.deepEqual(schemaRouter, router);
  t.is(stack.length, 2);
  t.is(stack[0].method, 'get');
  t.is(stack[0].path, '/foo/bar');
  t.is(stack[1].method, 'all');
  t.is(stack[1].path, '/bar/foo');
});

test('RouterSchema.property.handler()', (t) => {
  const routerSchema = new RouterSchema();
  const error = t.throws(() => routerSchema.handler());
  t.is(error.message, 'RouterSchema.handler() should be implemented');
});

