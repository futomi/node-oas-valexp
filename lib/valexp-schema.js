/* ------------------------------------------------------------------
* node-oas-valexp - valexp-schema.js
*
* Copyright (c) 2020, Futomi Hatano, All rights reserved.
* Released under the MIT license
* Date: 2020-04-04
* ---------------------------------------------------------------- */
'use strict';

class ValExpSchema {
  /* ------------------------------------------------------------------
  * Constructor
  *	
  * [Arguments]
  * - None
  * ---------------------------------------------------------------- */
  constructor() {
    this._error_name = '';
    this._error_code = '';
  }

  get errorName() {
    return this._error_name;
  }

  get errorCode() {
    return this._error_code;
  }

  _setError(name, code) {
    this._error_name = name || '';
    this._error_code = code || '';
  }

  /* ------------------------------------------------------------------
  * validate(schema) {
  * - Validate the specified schema object
  *
  * [Arguments]
  * - schema | Object | Required | Schema object
  * 
  * The Schema Object is defined by OpenAPI Specification:
  * https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.3.md#schemaObject
  * 
  * {
  *   "type": "integer",
  *   "minimum": 0,
  *   "maximum": 100
  * }
  *
  * [Returen value]
  * - If the parameter object is valid, the validated parameter object is returned.
  * - Otherwise, `this._error_name` and `this._error_code` are set, then `null` is returned.
  * ---------------------------------------------------------------- */
  validate(schema) {
    this._setError();

    if (!schema || typeof (schema) !== 'object') {
      this._setError('schema', 'ERR_SCHEMA');
      return null;
    }

    let something_of_name = '';
    let something_of_suffix = '';

    if ('oneOf' in schema) {
      something_of_name = 'oneOf';
      something_of_suffix = 'ONE_OF';
    } else if ('anyOf' in schema) {
      something_of_name = 'anyOf';
      something_of_suffix = 'ANY_OF';
    } else if ('allOf' in schema) {
      something_of_name = 'allOf';
      something_of_suffix = 'ALL_OF';
    }

    if (something_of_name) {
      let name = 'schema.' + something_of_name;
      let schema_list = schema[something_of_name];
      if (!Array.isArray(schema_list) || schema_list.length === 0) {
        let code = 'ERR_SCHEMA_' + something_of_suffix;
        this._setError(name, code);
        return null;
      }

      let valid = true;
      let validated_sch_list = [];
      for (let i = 0; i < schema_list.length; i++) {
        let sch = schema_list[i];
        let sch_name = name + '[' + i + ']';
        let validated_sch = this._validateSchemaObject(sch_name, sch);
        if (validated_sch) {
          validated_sch_list.push(validated_sch);
        } else {
          valid = false;
          break;
        }
      }
      if (valid === true) {
        let validated_schema = {};
        validated_schema[something_of_name] = validated_sch_list;
        return validated_schema;
      } else {
        return null;
      }

    } else {
      return this._validateSchemaObject('schema', schema);
    }
  }

  _validateSchemaObject(name, schema) {
    let validated_schema = {};

    let type = schema.type;
    if ('type' in schema) {
      let v = schema.type;
      if (typeof (v) !== 'string') {
        this._setError(name + '.type', 'ERR_SCHEMA_TYPE');
        return null;
      }
      validated_schema.type = v;
    } else {
      this._setError(name + '.type', 'ERR_SCHEMA_TYPE');
      return null;
    }

    if ('nullable' in schema) {
      let v = schema.nullable;
      if (typeof (v) !== 'boolean') {
        this._setError(name + '.nullable', 'ERR_SCHEMA_NULLABLE');
        return null;
      }
      validated_schema.nullable = v;
    }

    if ('enum' in schema) {
      if (/^(string|number|integer|boolean)$/.test(type) === false) {
        this._setError(name + '.enum', 'ERR_SCHEMA_ENUM');
        return null;
      }

      let enum_list = schema.enum;
      if (!Array.isArray(enum_list) || enum_list.length === 0 || !this._validateArrayUnique(enum_list)) {
        this._setError(name + '.enum', 'ERR_SCHEMA_ENUM');
        return null;
      }

      let el_type_valid = true;
      for (let el of enum_list) {
        let el_type = typeof (el);
        if (type === 'integer') {
          if (el_type !== 'number' || el % 1 !== 0) {
            el_type_valid = false;
            break;
          }
        } else {
          if (el_type !== type) {
            el_type_valid = false;
            break;
          }
        }
      }
      if (!el_type_valid) {
        this._setError(name + '.enum', 'ERR_SCHEMA_ENUM');
        return null;
      }

      validated_schema.enum = JSON.parse(JSON.stringify(enum_list));
    }

    let tdata = null;

    if (type === 'string') {
      tdata = this._validateString(name, schema);
    } else if (type === 'number') {
      tdata = this._validateNumber(name, schema);
    } else if (type === 'integer') {
      tdata = this._validateNumber(name, schema, true);
    } else if (type === 'boolean') {
      tdata = this._validateBoolean(name, schema);;
    } else if (type === 'array') {
      tdata = this._validateArray(name, schema);
    } else if (type === 'object') {
      tdata = this._validateObject(name, schema);
    } else {
      this._setError(name + '.type', 'ERR_SCHEMA_TYPE');
      return null;
    }

    if (tdata) {
      for (let [k, v] of Object.entries(tdata)) {
        validated_schema[k] = v;
      }
      return validated_schema;
    } else {
      return null;
    }
  }

  _validateString(name, schema) {
    let validated_schema = {};

    if ('minLength' in schema) {
      let v = schema.minLength;
      if (typeof (v) !== 'number' || v % 1 !== 0 || v < 0) {
        this._setError(name + '.minLength', 'ERR_SCHEMA_MIN_LENGTH');
        return null;
      }
      validated_schema.minLength = v;
    }

    if ('maxLength' in schema) {
      let v = schema.maxLength;
      if (typeof (v) !== 'number' || v % 1 !== 0 || v < 0) {
        this._setError(name + '.maxLength', 'ERR_SCHEMA_MAX_LENGTH');
        return null;
      }
      validated_schema.maxLength = v;
    }

    if ('pattern' in schema) {
      let re = schema.pattern;
      if (typeof (re) === 'string') {
        try {
          re = new RegExp(re);
        } catch (e) {
          this._setError(name + '.pattern', 'ERR_SCHEMA_PATTERN');
          return null;
        }
      }
      if (typeof (re) !== 'object' || re.constructor !== RegExp.prototype.constructor) {
        this._setError(name + '.pattern', 'ERR_SCHEMA_PATTERN');
        return null;
      }
      validated_schema.pattern = re;
    }

    if ('format' in schema) {
      let v = schema.format;
      if (typeof (v) !== 'string' || /^(date\-time|date|time|byte)$/.test(v) === false) {
        this._setError(name + '.format', 'ERR_SCHEMA_FORMAT_STRING');
        return null;
      }
      validated_schema.format = v;
    }

    if ('default' in schema) {
      let v = schema.default;
      if (typeof (v) !== 'string') {
        this._setError(name + '.default', 'ERR_SCHEMA_DEFAULT_STRING');
        return null;
      }
      validated_schema.default = v;
    }

    return validated_schema;
  }

  _validateNumber(name, schema, int_flag) {
    let validated_schema = {};

    if ('minimum' in schema) {
      let v = schema.minimum;
      if (typeof (v) !== 'number') {
        this._setError(name + '.minimum', 'ERR_SCHEMA_MINIMUM');
        return null;
      }
      validated_schema.minimum = v;

      if ('exclusiveMinimum' in schema) {
        let v = schema.exclusiveMinimum;
        if (typeof (v) !== 'boolean') {
          this._setError(name + '.exclusiveMinimum', 'ERR_SCHEMA_EXCLUSIVE_MINIMUM');
          return null;
        }
        validated_schema.exclusiveMinimum = v;
      }
    }

    if ('maximum' in schema) {
      let v = schema.maximum;
      if (typeof (v) !== 'number') {
        this._setError(name + '.maximum', 'ERR_SCHEMA_MAXIMUM');
        return null;
      }
      validated_schema.maximum = v;

      if ('exclusiveMaximum' in schema) {
        let v = schema.exclusiveMaximum;
        if (typeof (v) !== 'boolean') {
          this._setError(name + '.exclusiveMaximum', 'ERR_SCHEMA_EXCLUSIVE_MAXIMUM');
          return null;
        }
        validated_schema.exclusiveMaximum = v;
      }
    }

    if ('multipleOf' in schema) {
      let v = schema.multipleOf;
      if (typeof (v) !== 'number' || v <= 0) {
        this._setError(name + '.multipleOf', 'ERR_SCHEMA_MULTIPLE_OF');
        return null;
      }
      validated_schema.multipleOf = v;
    }

    if ('format' in schema) {
      let v = schema.format;
      if (int_flag) {
        if (typeof (v) !== 'string' || /^(int32|int64)$/.test(v) === false) {
          this._setError(name + '.format', 'ERR_SCHEMA_FORMAT_INTEGER');
          return null;
        }
        validated_schema.format = v;
      }
    }

    if ('default' in schema) {
      let v = schema.default;
      if (int_flag) {
        if (typeof (v) !== 'number' || v % 1 !== 0) {
          this._setError(name + '.default', 'ERR_SCHEMA_DEFAULT_INTEGER');
          return null;
        }
      } else {
        if (typeof (v) !== 'number') {
          this._setError(name + '.default', 'ERR_SCHEMA_DEFAULT_NUMBER');
          return null;
        }
      }
      validated_schema.default = v;
    }

    return validated_schema;
  }

  _validateBoolean(name, schema) {
    let validated_schema = {};

    if ('default' in schema) {
      let v = schema.default;
      if (typeof (v) !== 'boolean') {
        this._setError(name + '.default', 'ERR_SCHEMA_DEFAULT_BOOLEAN');
        return null;
      }
      validated_schema.default = v;
    }

    return validated_schema;
  }

  _validateArray(name, schema) {
    let validated_schema = {};

    if ('minItems' in schema) {
      let v = schema.minItems;
      if (typeof (v) !== 'number' || v % 1 !== 0 || v < 0) {
        this._setError(name + '.minItems', 'ERR_SCHEMA_MINITEMS');
        return null;
      }
      validated_schema.minItems = v;
    }

    if ('maxItems' in schema) {
      let v = schema.maxItems;
      if (typeof (v) !== 'number' || v % 1 !== 0 || v < 0) {
        this._setError(name + '.maxItems', 'ERR_SCHEMA_MAXITEMS');
        return null;
      }
      validated_schema.maxItems = v;
    }

    if ('uniqueItems' in schema) {
      let v = schema.uniqueItems;
      if (typeof (v) !== 'boolean') {
        this._setError(name + '.uniqueItems', 'ERR_SCHEMA_UNIQUE_ITEMS');
        return null;
      }
      validated_schema.uniqueItems = v;
    }

    if ('items' in schema) {
      let v = schema.items;
      if (typeof (v) !== 'object') {
        this._setError(name + '.items', 'ERR_SCHEMA_ITEMS');
        return null;
      }
      let sch = this._validateSchemaObject(name + '.items', schema.items);
      if (sch) {
        validated_schema.items = sch;
      } else {
        return null;
      }

    } else {
      this._setError(name + '.items', 'ERR_SCHEMA_ITEMS');
      return null;
    }

    if ('default' in schema) {
      let v = schema.default;
      if (!Array.isArray(v)) {
        this._setError(name + '.default', 'ERR_SCHEMA_DEFAULT_ARRAY');
        return null;
      }
      validated_schema.default = v;
    }

    return validated_schema;
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

  _validateObject(name, schema) {
    let validated_schema = {};

    if ('minProperties' in schema) {
      let v = schema.minProperties;
      if (typeof (v) !== 'number' || v % 1 !== 0 || v <= 0) {
        this._setError(name + '.minProperties', 'ERR_SCHEMA_MIN_PROPERTIES');
        return null;
      }
      validated_schema.minProperties = v;
    }

    if ('maxProperties' in schema) {
      let v = schema.maxProperties;
      if (typeof (v) !== 'number' || v % 1 !== 0 || v <= 0) {
        this._setError(name + '.maxProperties', 'ERR_SCHEMA_MAX_PROPERTIES');
        return null;
      }
      validated_schema.maxProperties = v;
    }

    if ('required' in schema) {
      let plist = schema.required;
      if (!Array.isArray(plist) || plist.length === 0) {
        this._setError(name + '.required', 'ERR_SCHEMA_REQUIRED');
        return null;
      }
      validated_schema.required = JSON.parse(JSON.stringify(plist));
    }

    if ('additionalProperties' in schema) {
      if (!('properties' in schema)) {
        this._setError(name + '.additionalProperties', 'ERR_SCHEMA_ADDITIONAL_PROPERTIES');
        return null;
      }

      let aprops = schema.additionalProperties;
      if (typeof (aprops) === 'boolean') {
        validated_schema.additionalProperties = aprops;
      } else if (typeof (aprops) === 'object') {
        let validated_aprops = this._validateSchemaObject(name + '.additionalProperties', aprops);
        if (validated_aprops) {
          validated_schema.additionalProperties = validated_aprops;
        } else {
          this._setError(name + '.additionalProperties', 'ERR_SCHEMA_ADDITIONAL_PROPERTIES');
          return null;
        }
      } else {
        this._setError(name + '.additionalProperties', 'ERR_SCHEMA_ADDITIONAL_PROPERTIES');
        return null;
      }

    } else {
      validated_schema.additionalProperties = true;
    }

    if ('properties' in schema) {
      if (typeof (schema.properties) !== 'object') {
        this._setError(name + '.properties', 'ERR_SCHEMA_PROPERTIES');
        return null;
      }

      let valid = true;
      validated_schema.properties = {};
      for (let [pname, pschema] of Object.entries(schema.properties)) {
        let validated_psch = this._validateSchemaObject(name + '.properties.' + pname, pschema);
        if (validated_psch) {
          validated_schema.properties[pname] = validated_psch;
        } else {
          valid = false;
          break;
        }
      }
      if (valid === false) {
        return null;
      }
    }

    if ('default' in schema) {
      let v = schema.default;
      if (typeof (v) !== 'object') {
        this._setError(name + '.default', 'ERR_SCHEMA_DEFAULT_OBJECT');
        return null;
      }
      validated_schema.default = v;
    }

    return validated_schema;
  }

}

module.exports = ValExpSchema;