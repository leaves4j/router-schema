const test = require('ava');
const utils = require('../lib/utils');


test('utils.isEmptyObject', (t) => {
  t.true(utils.isEmptyObject({}));
  t.false(utils.isEmptyObject(0));
  t.false(utils.isEmptyObject(123));
  t.false(utils.isEmptyObject(''));
  t.false(utils.isEmptyObject('foo'));
  t.false(utils.isEmptyObject(null));
  t.false(utils.isEmptyObject(undefined));
  t.false(utils.isEmptyObject(true));
  t.false(utils.isEmptyObject([]));
  t.false(utils.isEmptyObject([123]));
  t.false(utils.isEmptyObject({ length: 0 }));
  t.false(utils.isEmptyObject({ length: 1 }));
  t.false(utils.isEmptyObject({ length: 'bar' }));
  t.false(utils.isEmptyObject(Buffer(0)));
  t.false(utils.isEmptyObject(Buffer(100)));
});

