'use strict';
process.env.NODE_OAS_VALEXP_LANG = 'ja';
const ValExp = require('../lib/valexp.js');

const name = 'list';
const val = ['Taro', 'Jiro', 'Sabro', 'Shiro'];

const param = {
  name: name,
  required: true,
  schema: {
    type: "array",
    minItems: 1,
    maxItems: 4,
    uniqueItems: true,
    items: {
      type: "string",
    }
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