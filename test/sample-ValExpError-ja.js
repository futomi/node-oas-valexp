'use strict';

process.env.NODE_OAS_VALEXP_LANG = 'ja';
const ValExp = require('../lib/valexp.js');
const valexp = new ValExp({
  name: 'age',
  required: true,
  schema: {
    type: 'integer',
    mininum: 0,
    maximum: 120
  }
});

valexp.test(121); // This couses an validation error

console.log('- valExpName: ' + valexp.error.valExpName);
console.log('- valExpCode: ' + valexp.error.valExpCode);
console.log('- messsage  : ' + valexp.error.message);

