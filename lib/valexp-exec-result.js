/* ------------------------------------------------------------------
* node-oas-valexp - valexp-exec-result.js
*
* Copyright (c) 2020, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2020-04-04
* ---------------------------------------------------------------- */
'use strict';

class ValExpExecResult extends Array {
  constructor(list, props) {
    super();
    for (let el of list) {
      this.push(el);
    }
    this.input = props.input;
  }
}

module.exports = ValExpExecResult;