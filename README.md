router-schema
---
`router-schema` is a request router schema validator based on [joi](https://github.com/hapijs/joi) in node.js, support `express.js` and `koa.js@2.x` with `koa-router`.

+ [Installation](#installation)
+ [Example](#example)
+ [API](#api)
+ [Schema](#schema)
+ [Change Log](#change-log)

## Installation

```bash
npm install router-schema joi -S
```

## Example

Create `schema.js`:

```js
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

```

### Koa.js@2.x

```js
'use strict';

const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const { KoaRouterSchema } = require('router-schema');
const schema = require('./schema');

const routerSchema = new KoaRouterSchema(new Router());
const app = new Koa();
const router = routerSchema.loadSchema(schema);

// handle the errors
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (e) {
    ctx.body = e;
  }
});

app.use(bodyParser());
app.use(router.routes());
app.use((ctx) => {
  ctx.body = { hello: 'world' };
});

app.listen(8080);

```

### Express.js

```js
'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const { ExpressRouterSchema } = require('router-schema');
const schema = require('./schema');

const app = express();

const routerSchema = new ExpressRouterSchema(express.Router());
const router = routerSchema.loadSchema(schema);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(router);

app.use((req, res) => res.json({ hello: 'world' }));

// handle errors
app.use((error, req, res, next) => res.json(error));

app.listen(8080);

```

## API

todo

## Schema

todo

## ChangeLog

[ChangeLog](https://github.com/leaves4j/router-schema/blob/master/CHANGELOG.md)

## License

MIT