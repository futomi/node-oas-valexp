'use strict';
process.env.NODE_OAS_VALEXP_LANG = 'ja';
const ValExp = require('../lib/valexp.js');

const name = 'list';
const val = undefined;

const param = {
  name: name,
  schema: {
    type: "array",
    items: {
      type: "string",
    },
    default: ["a", "b"]
  }
};

const valexp = new ValExp(param);

let res = valexp.exec(val);
if (res) {
  console.log(res);
} else {
  console.log('Invalid.');
  console.log('- valExpName    : ' + valexp.error.valExpName);
  console.log('- valExpCode    : ' + valexp.error.valExpCode);
  console.log('- message:      : ' + valexp.error.message);
}