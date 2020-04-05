'use strict';
const ValExp = require('../lib/valexp.js');

const name = 'params';
const val = {
  method: "GET",
  path: "/hoge",
  limit: 100
};

const param = {
  name: name,
  required: true,
  schema: {
    type: "object",
    required: ["method", "path"],
    minProperties: 2,
    maxProperties: 3,
    properties: {
      method: {
        type: "string",
        enum: ["GET", "POST", "PUT", "DELETE"],
        required: true
      },
      path: {
        type: "string",
        required: true
      },
      limit: {
        type: "integer",
        required: false,
        minimum: 1,
        maximum: 100
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