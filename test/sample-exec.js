'use strict';

const ValExp = require('../lib/valexp.js');
const valexp = new ValExp({
  name: 'profile',
  required: true,
  schema: {
    type: 'object',
    properties: {
      age: {
        type: 'integer',
        mininum: 0,
        maximum: 120
      },
      gender: {
        type: 'string',
        enum: ['male', 'female', 'other'],
        default: 'other'
      }
    }
  }
});

let res = valexp.exec({age: 35});
console.log('- Before: ' + JSON.stringify(res.input));
console.log('- After : ' + JSON.stringify(res[0]));

