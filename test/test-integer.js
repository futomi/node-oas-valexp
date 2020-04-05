'use strict';
const ValExp = require('../lib/valexp.js');

const name = 'price';
const val = 10;

const param = {
  name: name,
  required: true,
  schema: {
    type: "integer",
    required: true,
    minimum: 0,
    maximum: 100,
    exclusiveMinimum: true,
    exclusiveMaximum: true,
    multipleOf: 10
  }
};

const valexp = new ValExp(param);

if (valexp.test(val)) {
  console.log('Valid.');
} else {
  console.log('Invalid.');
  console.log('- valExpName    : ' + valexp.error.valExpName);
  console.log('- valExpCode    : ' + valexp.error.valExpCode);
  console.log('- message:      : ' + valexp.error.message);
}