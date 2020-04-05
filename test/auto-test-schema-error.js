'use strict';
process.env.NODE_OAS_VALEXP_LANG = 'ja';
const ValExp = require('../lib/valexp.js');


// ERR_SCHEMA
errorTest('ERR_SCHEMA', null);
errorTest('ERR_SCHEMA', 'hoge');

// ERR_SCHEMA_TYPE
errorTest('ERR_SCHEMA_TYPE', { type: 'hoge' });

// ERR_SCHEMA_NULLABLE
errorTest('ERR_SCHEMA_NULLABLE', { type: 'string', nullable: 'hoge' });

// ERR_SCHEMA_ENUM
errorTest('ERR_SCHEMA_ENUM', { type: 'string', enum: 'hoge' });
errorTest('ERR_SCHEMA_ENUM', { type: 'string', enum: [] });
errorTest('ERR_SCHEMA_ENUM', { type: 'string', enum: [1] });
errorTest('ERR_SCHEMA_ENUM', { type: 'integer', enum: [1, 1] });
errorTest('ERR_SCHEMA_ENUM', { type: 'object', enum: [1, 2] });
errorTest('ERR_SCHEMA_ENUM', { type: 'array', enum: [1, 2] });

// ERR_SCHEMA_ONE_OF
errorTest('ERR_SCHEMA_ONE_OF', { oneOf: null });
errorTest('ERR_SCHEMA_ONE_OF', { oneOf: [] });

// ERR_SCHEMA_ANY_OF
errorTest('ERR_SCHEMA_ANY_OF', { anyOf: null });
errorTest('ERR_SCHEMA_ANY_OF', { anyOf: [] });

// ERR_SCHEMA_ALL_OF
errorTest('ERR_SCHEMA_ALL_OF', { allOf: null });
errorTest('ERR_SCHEMA_ALL_OF', { allOf: [] });

// ERR_SCHEMA_MIN_LENGTH
errorTest('ERR_SCHEMA_MIN_LENGTH', { type: 'string', minLength: -1 });
errorTest('ERR_SCHEMA_MIN_LENGTH', { type: 'string', minLength: 0.1 });
errorTest('ERR_SCHEMA_MIN_LENGTH', { type: 'string', minLength: true });

// ERR_SCHEMA_MAX_LENGTH
errorTest('ERR_SCHEMA_MAX_LENGTH', { type: 'string', maxLength: -1 });
errorTest('ERR_SCHEMA_MAX_LENGTH', { type: 'string', maxLength: 0.1 });
errorTest('ERR_SCHEMA_MAX_LENGTH', { type: 'string', maxLength: true });

// ERR_SCHEMA_PATTERN
errorTest('ERR_SCHEMA_PATTERN', { type: 'string', pattern: true });
errorTest('ERR_SCHEMA_PATTERN', { type: 'string', pattern: '^hoge\\' });
errorTest('ERR_SCHEMA_PATTERN', { type: 'string', pattern: new Date });

// ERR_SCHEMA_MINIMUM
errorTest('ERR_SCHEMA_MINIMUM', { type: 'number', minimum: true });
errorTest('ERR_SCHEMA_MINIMUM', { type: 'integer', minimum: true });

// ERR_SCHEMA_EXCLUSIVE_MINIMUM
errorTest('ERR_SCHEMA_EXCLUSIVE_MINIMUM', { type: 'number', minimum: 0, exclusiveMinimum: 1 });
errorTest('ERR_SCHEMA_EXCLUSIVE_MINIMUM', { type: 'integer', minimum: 0, exclusiveMinimum: 1 });

// ERR_SCHEMA_MAXIMUM
errorTest('ERR_SCHEMA_MAXIMUM', { type: 'number', maximum: true });
errorTest('ERR_SCHEMA_MAXIMUM', { type: 'integer', maximum: true });

// ERR_SCHEMA_EXCLUSIVE_MAXIMUM
errorTest('ERR_SCHEMA_EXCLUSIVE_MAXIMUM', { type: 'number', maximum: 10, exclusiveMaximum: 1 });
errorTest('ERR_SCHEMA_EXCLUSIVE_MAXIMUM', { type: 'integer', maximum: 10, exclusiveMaximum: 1 });

// ERR_SCHEMA_MULTIPLE_OF
errorTest('ERR_SCHEMA_MULTIPLE_OF', { type: 'number', multipleOf: 0 });
errorTest('ERR_SCHEMA_MULTIPLE_OF', { type: 'number', multipleOf: true });
errorTest('ERR_SCHEMA_MULTIPLE_OF', { type: 'integer', multipleOf: 0 });
errorTest('ERR_SCHEMA_MULTIPLE_OF', { type: 'integer', multipleOf: true });

// ERR_SCHEMA_MINITEMS
errorTest('ERR_SCHEMA_MINITEMS', { type: 'array', minItems: true });
errorTest('ERR_SCHEMA_MINITEMS', { type: 'array', minItems: -1 });
errorTest('ERR_SCHEMA_MINITEMS', { type: 'array', minItems: 0.1 });

// ERR_SCHEMA_MAXITEMS
errorTest('ERR_SCHEMA_MAXITEMS', { type: 'array', maxItems: true });
errorTest('ERR_SCHEMA_MAXITEMS', { type: 'array', maxItems: -1 });
errorTest('ERR_SCHEMA_MAXITEMS', { type: 'array', maxItems: 0.1 });

// ERR_SCHEMA_UNIQUE_ITEMS
errorTest('ERR_SCHEMA_UNIQUE_ITEMS', { type: 'array', uniqueItems: 1 });

// ERR_SCHEMA_ITEMS
errorTest('ERR_SCHEMA_ITEMS', { type: 'array', items: 1 });

// ERR_SCHEMA_MIN_PROPERTIES
errorTest('ERR_SCHEMA_MIN_PROPERTIES', { type: 'object', minProperties: true });
errorTest('ERR_SCHEMA_MIN_PROPERTIES', { type: 'object', minProperties: -1 });
errorTest('ERR_SCHEMA_MIN_PROPERTIES', { type: 'object', minProperties: 0.1 });

// ERR_SCHEMA_MAX_PROPERTIES
errorTest('ERR_SCHEMA_MAX_PROPERTIES', { type: 'object', maxProperties: true });
errorTest('ERR_SCHEMA_MAX_PROPERTIES', { type: 'object', maxProperties: -1 });
errorTest('ERR_SCHEMA_MAX_PROPERTIES', { type: 'object', maxProperties: 0.1 });

// ERR_SCHEMA_REQUIRED
errorTest('ERR_SCHEMA_REQUIRED', { type: 'object', required: true });
errorTest('ERR_SCHEMA_REQUIRED', { type: 'object', required: [] });

// ERR_SCHEMA_PROPERTIES
errorTest('ERR_SCHEMA_PROPERTIES', { type: 'object', properties: true });

// ERR_SCHEMA_ADDITIONAL_PROPERTIES
errorTest('ERR_SCHEMA_ADDITIONAL_PROPERTIES', { type: 'object', additionalProperties: 1 });

// ERR_SCHEMA_FORMAT_STRING
errorTest('ERR_SCHEMA_FORMAT_STRING', { type: 'string', format: 1 });
errorTest('ERR_SCHEMA_FORMAT_STRING', { type: 'string', format: 'hoge' });

// ERR_SCHEMA_FORMAT_INTEGER
errorTest('ERR_SCHEMA_FORMAT_INTEGER', { type: 'integer', format: 1 });
errorTest('ERR_SCHEMA_FORMAT_INTEGER', { type: 'integer', format: 'hoge' });

// ERR_SCHEMA_DEFAULT_STRING
errorTest('ERR_SCHEMA_DEFAULT_STRING', { type: 'string', default: 1 });

// ERR_SCHEMA_DEFAULT_INTEGER
errorTest('ERR_SCHEMA_DEFAULT_INTEGER', { type: 'integer', default: 'hoge' });
errorTest('ERR_SCHEMA_DEFAULT_INTEGER', { type: 'integer', default: 0.1 });

// ERR_SCHEMA_DEFAULT_NUMBER
errorTest('ERR_SCHEMA_DEFAULT_NUMBER', { type: 'number', default: 'hoge' });

// ERR_SCHEMA_DEFAULT_BOOLEAN
errorTest('ERR_SCHEMA_DEFAULT_BOOLEAN', { type: 'boolean', default: 'hoge' });

// ERR_SCHEMA_DEFAULT_ARRAY
errorTest('ERR_SCHEMA_DEFAULT_ARRAY', { type: 'array', items: { type: 'string' }, default: 'hoge' });

// ERR_SCHEMA_DEFAULT_OBJECT
errorTest('ERR_SCHEMA_DEFAULT_OBJECT', { type: 'object', default: 'hoge' });



console.log('======================================');
console.log('All tests were passed!');
console.log('======================================');

function errorTest(code, schema) {
  console.log('[' + code + ']')
  const param = {
    name: 'dummy',
    required: true,
    schema: schema
  };

  let error = null;
  try {
    const valexp = new ValExp(param);
  } catch (e) {
    error = e;
  }

  if (error) {
    console.log(error.valExpCode);
    console.log(error.valExpName);
    console.log(error.message);
    if (error.valExpCode === code) {
      console.log('OK');
      console.log('');
    } else {
      console.log('NG');
      process.exit();
    }
  } else {
    console.log('NG');
    process.exit();
  }

}
