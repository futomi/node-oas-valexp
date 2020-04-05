'use strict';
const ValExp = require('../lib/valexp.js');

const name = 'flag';
const val = true;
//const val = 1;

const param = {
  name: name,
  required: true,
  schema: {
    type: "boolean"
  }
};

const valexp = new ValExp(param);

if(valexp.test(val)) {
  console.log('Valid.');
} else {
  console.log('Invalid.');
  console.log('- valExpName    : ' + valexp.error.valExpName);
  console.log('- valExpCode    : ' + valexp.error.valExpCode);
  console.log('- message:      : ' + valexp.error.message);
}