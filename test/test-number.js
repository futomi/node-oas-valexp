'use strict';
const ValExp = require('../lib/valexp.js');

const name = 'temperature';
const val = -5.3;

const param = {
  name: name,
  required: true,
  schema: {
    type: "number",
    required: true,
    minimum: -10,
    maximum: 50,
    exclusiveMinimum: true,
    exclusiveMaximum: true,
    multipleOf: 0.2
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