const test = require('ava');
const JoiSchema = require('../lib/joi_schema');

test('JoiSchema.SchemaParser()', (t) => {
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
  const routerSchema = JoiSchema.SchemaParser(requestSchema);
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
  const joiSchema = new JoiSchema();
  const stack = [];
  const router = {
    get(path, handle) {
      stack.push({ method: 'get', path, handle });
    },
    all(path, handle) {
      stack.push({ method: 'all', path, handle });
    },
  };

  const schemaRouter = joiSchema.loadSchema(router, requestSchema);
  t.deepEqual(schemaRouter, router);
  t.is(stack.length, 2);
  t.is(stack[0].method, 'get');
  t.is(stack[0].path, '/foo/bar');
  t.is(stack[1].method, 'all');
  t.is(stack[1].path, '/bar/foo');
});

test('JoiSchema.property.handler()', (t) => {
  const joiSchema = new JoiSchema();
  const error = t.throws(() => joiSchema.handler());
  t.is(error.message, 'JoiSchema.handler() should be implemented');
});

