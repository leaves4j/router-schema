
const express = require('express');
const bodyParser = require('body-parser');
const { ExpressRouterSchema } = require('../../lib');
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

// app.listen(8081);

module.exports = app;
