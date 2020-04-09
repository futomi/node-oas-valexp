/* ------------------------------------------------------------------
* node-oas-valexp - valexp.js
*
* Copyright (c) 2020, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2020-04-09
* ---------------------------------------------------------------- */
'use strict';
const ValExpSchema = require('./valexp-schema.js');
const ValExpError = require('./valexp-error.js');
const ValExpExecResult = require('./valexp-exec-result.js');

class ValExp {
  /* ------------------------------------------------------------------
  * Constructor
  *	
  * [Arguments]
  * - parameter  | Object  | Required | Parameter Object
  *   - name     | String  | Required | Parameter name
  *   - required | Boolean | Optional | Flag whether reqired or not
  *   - schema   | Object  | Required | Schema
  * 
  * The Parameter Object is defined by OpenAPI Specification:
  * - https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.3.md#parameterObject
  * ---------------------------------------------------------------- */
  constructor(parameter) {
    this._parameter = null;
    this._error = null;

    // Check the `parameter`
    if (typeof (parameter) !== 'object') {
      throw new ValExpError('parameter', 'ERR_PARAM');
    }

    // Check the parameter.name
    let name = '';
    if ('name' in parameter) {
      let v = parameter.name;
      if (typeof (v) !== 'string' || v.length === 0) {
        throw new ValExpError('parameter.name', 'ERR_PARAM_NAME');
      }
      name = parameter.name;
    } else {
      throw new ValExpError('parameter.name', 'ERR_PARAM_NAME');
    }

    // Check the parameter.required
    let required = false;
    if ('required' in parameter) {
      let v = parameter.required;
      if (typeof (v) !== 'boolean') {
        throw new ValExpError('parameter.required', 'ERR_PARAM_REQUIRED');
      }
      required = v;
    }

    // Check the parameter.schema
    let oschema = new ValExpSchema();
    let schema = oschema.validate(parameter.schema);
    if (!schema) {
      let name = 'parameter.' + oschema.errorName;
      let code = oschema.errorCode;
      throw new ValExpError(name, code);
    }

    this._parameter = {
      name: name,
      required: required,
      schema: schema
    };
  }

  get source() {
    return JSON.stringify(this._parameter);
  }

  get error() {
    return this._error;
  }


  /* ------------------------------------------------------------------
  * toString() {
  * - Returns a string representing the list of the Parameter Objects
  *
  * [Arguments]
  * - None
  *
  * [Returen value]
  * - An array representing the list of the Parameter Objects
  * ---------------------------------------------------------------- */
  toString() {
    return JSON.stringify(this._parameter);
  }

  /* ------------------------------------------------------------------
  * test(val) {
  * - Evaluates the validity of the specified value
  *
  * [Arguments]
  * - val        | Any     | Required | Value
  *
  * [Returen value]
  * - If the value is valid, `true` will be returned.
  * - Otherwise, `this._error` is set, then `false` will be returned.
  * ---------------------------------------------------------------- */
  test(val) {
    this._error = null;
    this._validateValue(val, this._parameter);
    return this._error ? false : true;
  }

  /* ------------------------------------------------------------------
  * exec(val) {
  * - Evaluates the value and returns the validated value
  *
  * [Arguments]
  * - val        | Any     | Required | Value
  *
  * [Returen value]
  * - If the values are valid, an `ValExpResult` object will be returned.
  * - Otherwise, `this._error` is set, then `null` will be returned.
  * ---------------------------------------------------------------- */
  exec(val) {
    this._error = null;
    let validated_val = this._validateValue(val, this._parameter);
    if (this._error) {
      return null;
    } else {
      let res = new ValExpExecResult([validated_val], { input: val });
      return res;
    }
  }

  _setValidationError(name, code, binds) {
    this._error = new ValExpError(name, code, binds);
  }

  _validateValue(val, pobj) {
    let name = pobj.name;
    let required = pobj.required;
    let schema = pobj.schema;

    if (val === undefined) {
      if (required === true) {
        this._setValidationError(name, 'ERR_VALUE_REQUIRED');
        return;
      } else {
        if ('default' in schema) {
          return schema.default;
        } else {
          return;
        }
      }
    }

    if ('nullable' in schema) {
      if (schema.nullable === true) {
        if (val === null) {
          return null;
        }
      }
    }

    if ('oneOf' in schema) {
      return this._validateOneOf(name, val, schema.oneOf);
    } else if ('anyOf' in schema) {
      return this._validateAnyOf(name, val, schema.anyOf);
    } else if ('allOf' in schema) {
      return this._validateAllOf(name, val, schema.allOf);
    }

    if ('enum' in schema) {
      if (!schema.enum.includes(val)) {
        this._setValidationError(name, 'ERR_VALUE_ENUM', {
          enumList: JSON.stringify(schema.enum)
        });
        return;
      }
    }

    if (schema.type === 'string') {
      return this._validateString(name, val, schema);
    } else if (schema.type === 'number') {
      return this._validateNumber(name, val, schema);
    } else if (schema.type === 'integer') {
      return this._validateNumber(name, val, schema, true);
    } else if (schema.type === 'boolean') {
      return this._validateBoolean(name, val, schema);
    } else if (schema.type === 'array') {
      return this._validateArray(name, val, schema);
    } else if (schema.type === 'object') {
      return this._validateObject(name, val, schema);
    } else {
      this._setValidationError('schema.type', 'ERR_SCHEMA_TYPE');
      return;
    }
  }

  _validateOneOf(name, val, schema_list) {
    let valid_schema_num = 0;
    for (let schema of schema_list) {
      if (this._validateValue(val, { name: name, schema: schema })) {
        valid_schema_num++;
      }
    }
    if (valid_schema_num === 1) {
      this._error = null;
      return val;
    } else {
      this._setValidationError(name, 'ERR_VALUE_ONE_OF');
      return;
    }
  }

  _validateAnyOf(name, val, schema_list) {
    let valid_schema_num = 0;
    for (let schema of schema_list) {
      if (this._validateValue(val, { name: name, schema: schema })) {
        valid_schema_num++;
      }
    }
    if (valid_schema_num >= 1) {
      this._error = null;
      return val;
    } else {
      this._setValidationError(name, 'ERR_VALUE_ANY_OF');
      return;
    }
  }

  _validateAllOf(name, val, schema_list) {
    let valid_schema_num = 0;
    for (let schema of schema_list) {
      if (this._validateValue(val, { name: name, schema: schema })) {
        valid_schema_num++;
      }
    }
    if (valid_schema_num === schema_list.length) {
      this._error = null;
      return val;
    } else {
      this._setValidationError(name, 'ERR_VALUE_ALL_OF');
      return;
    }
  }

  _validateString(name, val, schema) {
    if (typeof (val) !== 'string') {
      this._setValidationError(name, 'ERR_VALUE_STRING_TYPE');
      return;
    }

    if ('format' in schema) {
      if (!this._validateStringFormat(val, schema.format)) {
        this._setValidationError(name, 'ERR_VALUE_FORMAT_STRING', { format: schema.format });
        return;
      }
    }

    if ('minLength' in schema) {
      if (val.length < schema.minLength) {
        this._setValidationError(name, 'ERR_VALUE_STRING_MIN_LENGTH', { minLength: schema.minLength });
        return;
      }
    }

    if ('maxLength' in schema) {
      if (val.length > schema.maxLength) {
        this._setValidationError(name, 'ERR_VALUE_STRING_MAX_LENGTH', { maxLength: schema.maxLength });
        return;
      }
    }

    if ('pattern' in schema) {
      if (schema.pattern.test(val) === false) {
        this._setValidationError(name, 'ERR_VALUE_STRING_PATTERN', { pattern: schema.pattern.toString() });
        return;
      }
    }

    return val;
  }

  _validateStringFormat(val, format) {
    if (format === 'date-time') {
      return this._validateStringFormatDateTime(val);
    } else if (format === 'date') {
      return this._validateStringFormatDate(val);
    } else if (format === 'time') {
      return this._validateStringFormatTime(val);
    } else if (format === 'byte') {
      return this._validateStringFormatByte(val);
    } else {
      return true;
    }
  }

  _validateStringFormatDateTime(val) {
    // https://tools.ietf.org/html/rfc3339#section-5.6
    let re = /^\d{4}\-\d{2}\-\d{2}T\d{2}\:\d{2}\:\d{2}(\.\d{1,3})?/;
    let m = re.exec(val);
    if (!m) {
      return false;
    }
    let date_time = m[0];

    let tz = val.replace(re, '');
    if (!(tz === 'Z' || /^[\+\-]\d{2}\:\d{2}$/.test(tz))) {
      return false;
    }

    let [date, time] = date_time.split('T');
    if (!this._validateStringFormatDate(date)) {
      return false;
    }
    if (!this._validateStringFormatTime(time)) {
      return false;
    }
    if (!this._validateStringFormatTimeZone(tz)) {
      return false;
    }

    return true;
  }

  _validateStringFormatDate(val) {
    let re = /^(\d{4})\-(\d{2})\-(\d{2})$/;
    let match = re.exec(val);
    if (!match) {
      return false;
    }

    let Y = parseInt(match[1], 10);
    let M = parseInt(match[2], 10);
    let D = parseInt(match[3], 10);

    if (M === 0 || M > 12) {
      return false;
    }
    if (D === 0 || D > 31) {
      return false;
    }

    let dt = new Date(Y, M - 1, D);
    if (dt.getFullYear() === Y && dt.getMonth() === M - 1 && dt.getDate() === D) {
      return true;
    } else {
      return false;
    }
  }

  _validateStringFormatTime(val) {
    let re = /^(\d{2})\:(\d{2})\:((\d{2})(\.\d{1,3})?)$/;
    let match = re.exec(val);
    if (!match) {
      return false;
    }

    let h = parseInt(match[1], 10);
    let m = parseInt(match[2], 10);
    let s = parseFloat(match[3]);

    if (h > 23 || m > 59 || s >= 60) {
      return false;
    }

    return true;
  }

  _validateStringFormatTimeZone(val) {
    if (val === 'Z') {
      return true;
    }

    // https://en.wikipedia.org/wiki/Time_zone

    let re = /^([\+\-])(\d{2})\:(\d{2})$/;
    let match = re.exec(val);
    if (!match) {
      return false;
    }

    let sign = match[1];
    let h = parseInt(match[2], 10);
    let m = parseInt(match[3], 10);

    if (sign === '-') {
      if (h > 12) {
        return false;
      }
    } else {
      if (h > 14) {
        return false;
      }
    }

    if (!(m === 0 || m === 30 || m === 45)) {
      return false;
    }

    return true;
  }

  _validateStringFormatByte(val) {
    if (typeof (val) !== 'string' || /[^a-zA-Z0-9\+\/\=]+$/.test(val)) {
      return false;
    }
    let buf = null;
    try {
      buf = Buffer.from(val, 'base64');
    } catch (e) {
      return false;
    }
    if (!buf) {
      return false;
    }
    buf = null;
    return true;
  }

  _validateNumber(name, val, schema, int_flag) {
    let etype = int_flag ? 'INTEGER' : 'NUMBER';

    if (typeof (val) !== 'number') {
      this._setValidationError(name, 'ERR_VALUE_' + etype + '_TYPE');
      return;
    }

    if (int_flag) {
      if (val % 1 !== 0) {
        this._setValidationError(name, 'ERR_VALUE_' + etype + '_TYPE');
        return;
      }
    }

    if ('format' in schema) {
      let fmt = schema.format;
      if (int_flag) {
        if (fmt === 'int32') {
          if (val < -2147483648 || val > 2147483647) {
            this._setValidationError(name, 'ERR_VALUE_FORMAT_INTEGER', { format: fmt });
            return;
          }
        } else if (fmt === 'int64') {
          if (val < Number.MIN_SAFE_INTEGER || val > Number.MAX_SAFE_INTEGER) {
            // Number.MIN_SAFE_INTEGER: -9007199254740991
            // Number.MAX_SAFE_INTEGER:  9007199254740991
            this._setValidationError(name, 'ERR_VALUE_FORMAT_INTEGER', { format: fmt });
            return;
          }
        }
      }
    }

    if ('minimum' in schema) {
      let min = schema.minimum;
      if (val < min) {
        this._setValidationError(name, 'ERR_VALUE_' + etype + '_MINIMUM', { minimum: min });
        return;
      }

      if (schema.exclusiveMinimum) {
        if (val === min) {
          this._setValidationError(name, 'ERR_VALUE_' + etype + '_EXCLUSIVE_MINIMUM', { minimum: min });
          return;
        }
      }
    }

    if ('maximum' in schema) {
      let max = schema.maximum;
      if (val > max) {
        this._setValidationError(name, 'ERR_VALUE_' + etype + '_MAXIMUM', { maximum: max });
        return;
      }

      if (schema.exclusiveMaximum) {
        if (val === max) {
          this._setValidationError(name, 'ERR_VALUE_' + etype + '_EXCLUSIVE_MAXIMUM', { maximum: max });
          return;
        }
      }
    }

    if ('multipleOf' in schema) {
      let mul = schema.multipleOf;
      let after_point = (mul.toString().split('.'))[1];
      let target_val = val;
      let target_mul = mul;
      if (after_point) {
        target_mul = mul * Math.pow(10, after_point.length);
        target_val = target_val * Math.pow(10, after_point.length);
      }
      if (target_val % target_mul !== 0) {
        this._setValidationError(name, 'ERR_VALUE_' + etype + '_MULTIPLE_OF', { multipleOf: mul.toString() });
        return;
      }
    }

    return val;
  }

  _validateBoolean(name, val) {
    if (typeof (val) === 'boolean') {
      return val;
    } else {
      this._setValidationError(name, 'ERR_VALUE_BOOLEAN_TYPE');
      return;
    }
  }

  _validateArray(name, val, schema) {
    if (!Array.isArray(val)) {
      this._setValidationError(name, 'ERR_VALUE_ARRAY_TYPE');
      return;
    }

    if ('minItems' in schema) {
      let min = schema.minItems;
      if (val.length < min) {
        this._setValidationError(name, 'ERR_VALUE_ARRAY_MIN_ITEMS', { minItems: min });
        return;
      }
    }

    if ('maxItems' in schema) {
      let max = schema.maxItems;
      if (val.length > max) {
        this._setValidationError(name, 'ERR_VALUE_ARRAY_MAX_ITEMS', { maxItems: max });
        return;
      }
    }

    if ('uniqueItems' in schema) {
      let uni = schema.uniqueItems;
      if (uni === true) {
        if (!this._validateArrayUnique(val)) {
          this._setValidationError(name, 'ERR_VALUE_ARRAY_UNIQUEITEMS');
          return;
        }
      }
    }

    let valid = true;
    let validated_array = [];
    for (let i = 0; i < val.length; i++) {
      let el = val[i];
      let el_name = name + '[' + i + ']';
      let validated_el = this._validateValue(el, { name: el_name, schema: schema.items });
      if (this._error) {
        valid = false;
        break;
      } else {
        validated_array.push(validated_el);
      }
    }

    if (valid === false) {
      return;
    }

    return validated_array;
  }

  _validateArrayUnique(array) {
    let is_unique = true;
    let checked_list = [];
    for (let el of array) {
      for (let checked_el of checked_list) {
        if (el === checked_el) {
          is_unique = false;
          break;
        }
      }
      if (is_unique === false) {
        break;
      }
      checked_list.push(el);
    }
    return is_unique;
  }

  _validateObject(name, val, schema) {
    if (typeof (val) !== 'object' || val === null || val.constructor.name !== 'Object') {
      this._setValidationError(name, 'ERR_VALUE_OBJECT_TYPE');
      return;
    }

    if ('minProperties' in schema) {
      let min = schema.minProperties;
      if (Object.keys(val).length < min) {
        this._setValidationError(name, 'ERR_VALUE_OBJECT_MIN_PROPERTIES', { minProperties: min });
        return;
      }
    }

    if ('maxProperties' in schema) {
      let max = schema.maxProperties;
      if (Object.keys(val).length > max) {
        this._setValidationError(name, 'ERR_VALUE_OBJECT_MAX_PROPERTIES', { maxProperties: max });
        return;
      }
    }

    if ('required' in schema) {
      let plist = schema.required;
      let missing_pname = '';
      for (let pname of plist) {
        if (!(pname in val)) {
          missing_pname = pname;
          break;
        }
      }
      if (missing_pname) {
        this._setValidationError(name, 'ERR_VALUE_OBJECT_REQUIRED', { missingPropertyName: missing_pname });
        return;
      }
    }

    let validated_obj = {};

    if ('properties' in schema) {
      if (schema.additionalProperties === false) {
        let unknown_pname = '';
        for (let pname of Object.keys(val)) {
          if (!(pname in schema.properties)) {
            unknown_pname = pname;
            break;
          }
        }
        if (unknown_pname) {
          this._setValidationError(name, 'ERR_VALUE_OBJECT_ADDITIONAL_PROPERTIES', { unknownPropertyName: unknown_pname });
          return;
        }
      }

      let valid = true;
      for (let [pname, pschema] of Object.entries(schema.properties)) {
        let validated_val = this._validateValue(val[pname], { name: name + '.' + pname, schema: pschema });
        if (this._error) {
          valid = false;
          break;
        }
        validated_obj[pname] = validated_val;
      }
      if (valid === false) {
        return;
      }

      if (typeof (schema.additionalProperties) === 'object') {
        let sch = schema.additionalProperties;
        for (let [pname, pval] of Object.entries(val)) {
          if (pname in schema.properties) {
            continue;
          }
          let validated_val = this._validateValue(pval, { name: name + '.' + pname, schema: sch });
          if (this._error) {
            valid = false;
            break;
          }
          validated_obj[pname] = validated_val;
        }
        if (valid === false) {
          return;
        }
      }
    }

    return validated_obj;
  }

}

module.exports = ValExp;