/* ------------------------------------------------------------------
* node-oas-valexp - valexp-error.js
*
* Copyright (c) 2020, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2020-04-04
* ---------------------------------------------------------------- */
'use strict';
const mPath = require('path');
const mFs = require('fs');

let EMSGS = {};
(() => {
  let lang = process.env.NODE_OAS_VALEXP_LANG;
  if (!lang || !(/^[a-z]{2}$/.test(lang) || /^[a-z]{2}\-[A-Z]{2}$/.test(lang))) {
    lang = 'en';
  }
  let fpath = mPath.join(__dirname, 'errors', lang + '.json');
  if (!mFs.existsSync(fpath)) {
    if (lang !== 'en') {
      fpath = mPath.join(__dirname, 'errors', 'en.json');
    }
  }
  EMSGS = require(fpath);
})();


class ValExpError extends Error {
  constructor(name, code, binds, message) {
    super();

    this._name = name;
    this._code = code;

    if (!message) {
      if (code in EMSGS) {
        message = EMSGS[code]
      } else {
        message = code;
      }
    }

    if (binds) {
      for (let [k, v] of Object.entries(binds)) {
        let re = new RegExp('{{\\s*' + k + '\\s*}}', 'g');
        message = message.replace(re, v);
      }
    }
    message = message.replace(/{{\s*name\s*}}/g, name)
    this.message = message;
  }

  get valExpName() {
    return this._name;
  }

  get valExpCode() {
    return this._code;
  }

}

module.exports = ValExpError;