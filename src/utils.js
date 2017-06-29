// @flow

/**
 * check empty object '{}'
 *
 * @param {*} obj
 * @returns
 */
function isEmptyObject(obj: any): boolean {
  if (!obj || !isNaN(obj.length) || typeof obj !== 'object') { return false; }
  return Object.keys(obj).length === 0;
}

exports.isEmptyObject = isEmptyObject;
