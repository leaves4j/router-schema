const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const { KoaRouterSchema } = require('../../lib');
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

// app.listen(8080);

module.exports = app;
