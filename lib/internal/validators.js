'use strict';

const {
  ERR_INVALID_ARG_TYPE,
  ERR_INVALID_ARG_VALUE,
  ERR_OUT_OF_RANGE
} = require('internal/errors').codes;

function isInt32(value) {
  return value === (value | 0);
}

function isUint32(value) {
  return value === (value >>> 0);
}

function validateInteger(value, name) {
  let err;

  if (typeof value !== 'number')
    err = new ERR_INVALID_ARG_TYPE(name, 'number', value);
  else if (!Number.isSafeInteger(value))
    err = new ERR_OUT_OF_RANGE(name, 'an integer', value);

  if (err) {
    Error.captureStackTrace(err, validateInteger);
    throw err;
  }
}

function validateInt32(value, name, min = -2147483648, max = 2147483647) {
  if (!isInt32(value)) {
    let err;
    if (typeof value !== 'number') {
      err = new ERR_INVALID_ARG_TYPE(name, 'number', value);
    } else if (!Number.isInteger(value)) {
      err = new ERR_OUT_OF_RANGE(name, 'an integer', value);
    } else {
      err = new ERR_OUT_OF_RANGE(name, `>= ${min} && <= ${max}`, value);
    }
    Error.captureStackTrace(err, validateInt32);
    throw err;
  } else if (value < min || value > max) {
    const err = new ERR_OUT_OF_RANGE(name, `>= ${min} && <= ${max}`, value);
    Error.captureStackTrace(err, validateInt32);
    throw err;
  }

  return value;
}

function validateUint32(value, name, positive) {
  if (!isUint32(value)) {
    let err;
    if (typeof value !== 'number') {
      err = new ERR_INVALID_ARG_TYPE(name, 'number', value);
    } else if (!Number.isInteger(value)) {
      err = new ERR_OUT_OF_RANGE(name, 'an integer', value);
    } else {
      const min = positive ? 1 : 0;
      // 2 ** 32 === 4294967296
      err = new ERR_OUT_OF_RANGE(name, `>= ${min} && < 4294967296`, value);
    }
    Error.captureStackTrace(err, validateUint32);
    throw err;
  } else if (positive && value === 0) {
    const err = new ERR_OUT_OF_RANGE(name, '>= 1 && < 4294967296', value);
    Error.captureStackTrace(err, validateUint32);
    throw err;
  }

  return value;
}

module.exports = {
  isInt32,
  isUint32,
  validateMode,
  validateInteger,
  validateInt32,
  validateUint32
};
