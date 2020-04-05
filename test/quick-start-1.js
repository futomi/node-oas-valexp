'use strict';

const ValExp = require('../lib/valexp.js');

//howOldAreYou(35);
howOldAreYou(121);

function howOldAreYou(age) {
  const valexp = new ValExp({
    name: 'age',
    required: true,
    schema: {
      type: 'integer',
      mininum: 0,
      maximum: 120
    }
  });

  if (valexp.test(age)) {
    console.log('Thank you.');
  } else {
    console.log(valexp.error.message);
  }
}

