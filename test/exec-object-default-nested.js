'use strict';
process.env.NODE_OAS_VALEXP_LANG = 'ja';
const ValExp = require('../lib/valexp.js');

const name = 'hoge';
const val = {};

const param = {
  name: name,
  required: true,
  schema: {
    type: "object",
    properties: {
      method: {
        type: "string",
        enum: ["GET", "POST", "PUT", "DELETE"],
        default: 'GET'
      },
      flag: {
        type: "boolean",
        default: true
      },
      limit: {
        type: "integer",
        default: 20
      },
      level: {
        type: "number",
        default: 0.1
      },
      list: {
        type: "array",
        items: {
          type: "integer"
        },
        default: [1, 2, 3]
      },
      map: {
        type: "object",
        default: { hoge: 1 }
      }
    }
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