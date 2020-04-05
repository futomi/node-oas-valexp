'use strict';

const ValExp = require('../lib/valexp.js');
const valexp = new ValExp({
  name: 'age',
  schema: { type: 'integer' }
});
console.log(valexp.source);


