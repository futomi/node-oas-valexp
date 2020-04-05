'use strict';

const ValExp = require('../lib/valexp.js');

tellYourProfile({ age: 35 });

function tellYourProfile(profile) {
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

  let res = valexp.exec(profile);
  if(res) {
    console.log('Thank you.');
    console.log(res[0]);
  } else {
    console.log(valexp.error.message);
  }
}

