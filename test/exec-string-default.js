'use strict';
const ValExp = require('../lib/valexp.js');

const name = 'nickname';
const val = undefined;

const param = {
  name: name,
  schema: {
    type: "string",
    default: 'hoge'
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