'use strict';
const ValExp = require('../lib/valexp.js');

const name = 'nickname';
const val = 'Taro-';

const param = {
  name: name,
  required: true,
  schema: {
    type: "string",
    required: true,
    minLength: 0,
    maxLength: 100,
    //pattern: /^[a-zA-Z\s]+\-$/
    //pattern: '^[a-zA-Z\\s]+\\-$'
    pattern: new RegExp('^[a-zA-Z\\s]+\\-$')
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