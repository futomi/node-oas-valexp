'use strict';
//process.env.NODE_OAS_VALEXP_LANG = 'ja';
process.env.NODE_OAS_VALEXP_LANG = 'en';
const ValExp = require('../lib/valexp.js');


// ERR_VALUE_REQUIRED
errorTest('ERR_VALUE_REQUIRED', undefined, {
  name: 'hoge',
  required: true,
  schema: {
    type: 'string'
  }
});

errorTest('ERR_VALUE_REQUIRED', undefined, {
  name: 'hoge',
  required: true,
  schema: {
    type: 'integer'
  }
});

errorTest('ERR_VALUE_REQUIRED', undefined, {
  name: 'hoge',
  required: true,
  schema: {
    type: 'number'
  }
});

errorTest('ERR_VALUE_REQUIRED', undefined, {
  name: 'hoge',
  required: true,
  schema: {
    type: 'boolean'
  }
});

errorTest('ERR_VALUE_REQUIRED', undefined, {
  name: 'hoge',
  required: true,
  schema: {
    type: 'array',
    items: { type: 'string' }
  }
});

errorTest('ERR_VALUE_REQUIRED', undefined, {
  name: 'hoge',
  required: true,
  schema: {
    type: 'object'
  }
});

// ERR_VALUE_ONE_OF
errorTest('ERR_VALUE_ONE_OF', true, {
  name: 'hoge',
  schema: {
    oneOf: [
      { type: 'string' },
      { type: 'integer' }
    ]
  }
});

errorTest('ERR_VALUE_ONE_OF', 1, {
  name: 'hoge',
  schema: {
    oneOf: [
      { type: 'number' },
      { type: 'integer' }
    ]
  }
});

// ERR_VALUE_ANY_OF
errorTest('ERR_VALUE_ANY_OF', 0.1, {
  name: 'hoge',
  schema: {
    anyOf: [
      { type: 'integer' },
      { type: 'string' }
    ]
  }
});

// ERR_VALUE_ALL_OF
errorTest('ERR_VALUE_ALL_OF', 0.1, {
  name: 'hoge',
  schema: {
    allOf: [
      { type: 'number' },
      { type: 'integer' }
    ]
  }
});

// ERR_VALUE_STRING_TYPE
errorTest('ERR_VALUE_STRING_TYPE', 1, {
  name: 'hoge',
  schema: {
    type: 'string'
  }
});

// ERR_VALUE_FORMAT_STRING
errorTest('ERR_VALUE_FORMAT_STRING', '2020-02-31T09:30:01.000+09:00', {
  name: 'string-format-date-time-1',
  schema: {
    type: 'string',
    format: 'date-time'
  }
});

errorTest('ERR_VALUE_FORMAT_STRING', '2020-02-01T24:30:01.000+09:00', {
  name: 'string-format-date-time-2',
  schema: {
    type: 'string',
    format: 'date-time'
  }
});

errorTest('ERR_VALUE_FORMAT_STRING', '2020-02-01T09:60:01.000+09:00', {
  name: 'string-format-date-time-3',
  schema: {
    type: 'string',
    format: 'date-time'
  }
});

errorTest('ERR_VALUE_FORMAT_STRING', '2020-02-01T09:30:60.000+09:00', {
  name: 'string-format-date-time-4',
  schema: {
    type: 'string',
    format: 'date-time'
  }
});

errorTest('ERR_VALUE_FORMAT_STRING', '2020-02-01T09:30:01.0001+09:00', {
  name: 'string-format-date-time-5',
  schema: {
    type: 'string',
    format: 'date-time'
  }
});

errorTest('ERR_VALUE_FORMAT_STRING', '2020-02-01T09:30:01.001+23:00', {
  name: 'string-format-date-time-6',
  schema: {
    type: 'string',
    format: 'date-time'
  }
});

errorTest('ERR_VALUE_FORMAT_STRING', '2020-02-01T09:30:01.001+09:10', {
  name: 'string-format-date-time-7',
  schema: {
    type: 'string',
    format: 'date-time'
  }
});

errorTest('ERR_VALUE_FORMAT_STRING', '2020-13-01', {
  name: 'string-format-date-1',
  schema: {
    type: 'string',
    format: 'date'
  }
});

errorTest('ERR_VALUE_FORMAT_STRING', '2020-02-31', {
  name: 'string-format-date-2',
  schema: {
    type: 'string',
    format: 'date'
  }
});

errorTest('ERR_VALUE_FORMAT_STRING', '24:00:00', {
  name: 'string-format-time-1',
  schema: {
    type: 'string',
    format: 'time'
  }
});

errorTest('ERR_VALUE_FORMAT_STRING', '00:60:00', {
  name: 'string-format-time-2',
  schema: {
    type: 'string',
    format: 'time'
  }
});

errorTest('ERR_VALUE_FORMAT_STRING', '00:00:60', {
  name: 'string-format-time-3',
  schema: {
    type: 'string',
    format: 'time'
  }
});

errorTest('ERR_VALUE_FORMAT_STRING', '00:00', {
  name: 'string-format-time-4',
  schema: {
    type: 'string',
    format: 'time'
  }
});

errorTest('ERR_VALUE_FORMAT_STRING', '00:00:00:00', {
  name: 'string-format-time-5',
  schema: {
    type: 'string',
    format: 'time'
  }
});

errorTest('ERR_VALUE_FORMAT_STRING', '???', {
  name: 'string-format-time-6',
  schema: {
    type: 'string',
    format: 'byte'
  }
});


// ERR_VALUE_FORMAT_INTEGER
errorTest('ERR_VALUE_FORMAT_INTEGER', -2147483649, {
  name: 'string-format-int32-1',
  schema: {
    type: 'integer',
    format: 'int32'
  }
});

errorTest('ERR_VALUE_FORMAT_INTEGER', 2147483648, {
  name: 'string-format-int32-2',
  schema: {
    type: 'integer',
    format: 'int32'
  }
});

errorTest('ERR_VALUE_FORMAT_INTEGER', -9007199254740992, {
  name: 'string-format-int64-1',
  schema: {
    type: 'integer',
    format: 'int64'
  }
});

errorTest('ERR_VALUE_FORMAT_INTEGER', 9007199254740992, {
  name: 'string-format-int64-1',
  schema: {
    type: 'integer',
    format: 'int64'
  }
});

// ERR_VALUE_STRING_MIN_LENGTH
errorTest('ERR_VALUE_STRING_MIN_LENGTH', 'a', {
  name: 'string-min-length',
  schema: {
    type: 'string',
    minLength: 2
  }
});

// ERR_VALUE_STRING_MAX_LENGTH
errorTest('ERR_VALUE_STRING_MAX_LENGTH', 'abc', {
  name: 'string-max-length',
  schema: {
    type: 'string',
    maxLength: 2
  }
});

// ERR_VALUE_STRING_PATTERN
errorTest('ERR_VALUE_STRING_PATTERN', '123-456', {
  name: 'string-max-pattern',
  schema: {
    type: 'string',
    pattern: '^\\d{3}\\-\\d{4}$'
  }
});

// ERR_VALUE_NUMBER_TYPE
errorTest('ERR_VALUE_NUMBER_TYPE', '1', {
  name: 'number-type',
  schema: {
    type: 'number'
  }
});

// ERR_VALUE_NUMBER_MINIMUM
errorTest('ERR_VALUE_NUMBER_MINIMUM', 0, {
  name: 'number-minimum',
  schema: {
    type: 'number',
    minimum: 1
  }
});

// ERR_VALUE_NUMBER_EXCLUSIVE_MINIMUM
errorTest('ERR_VALUE_NUMBER_EXCLUSIVE_MINIMUM', 1, {
  name: 'number-exclusive-minimum',
  schema: {
    type: 'number',
    minimum: 1,
    exclusiveMinimum: true
  }
});

// ERR_VALUE_NUMBER_MAXIMUM
errorTest('ERR_VALUE_NUMBER_MAXIMUM', 2, {
  name: 'number-maximum',
  schema: {
    type: 'number',
    maximum: 1
  }
});

// ERR_VALUE_NUMBER_EXCLUSIVE_MAXIMUM
errorTest('ERR_VALUE_NUMBER_EXCLUSIVE_MAXIMUM', 1, {
  name: 'number-exclusive-maximum',
  schema: {
    type: 'number',
    maximum: 1,
    exclusiveMaximum: true
  }
});

// ERR_VALUE_NUMBER_MULTIPLE_OF
errorTest('ERR_VALUE_NUMBER_MULTIPLE_OF', 9, {
  name: 'number-multiple-of',
  schema: {
    type: 'number',
    multipleOf: 10
  }
});

// ERR_VALUE_INTEGER_TYPE
errorTest('ERR_VALUE_INTEGER_TYPE', '1', {
  name: 'integer-type',
  schema: {
    type: 'integer'
  }
});

// ERR_VALUE_INTEGER_MINIMUM
errorTest('ERR_VALUE_INTEGER_MINIMUM', 0, {
  name: 'integer-minimum',
  schema: {
    type: 'integer',
    minimum: 1
  }
});

// ERR_VALUE_INTEGER_EXCLUSIVE_MINIMUM
errorTest('ERR_VALUE_INTEGER_EXCLUSIVE_MINIMUM', 1, {
  name: 'integer-exclusive-minimum',
  schema: {
    type: 'integer',
    minimum: 1,
    exclusiveMinimum: true
  }
});

// ERR_VALUE_INTEGER_MAXIMUM
errorTest('ERR_VALUE_INTEGER_MAXIMUM', 2, {
  name: 'integer-maximum',
  schema: {
    type: 'integer',
    maximum: 1
  }
});

// ERR_VALUE_INTEGER_EXCLUSIVE_MAXIMUM
errorTest('ERR_VALUE_INTEGER_EXCLUSIVE_MAXIMUM', 1, {
  name: 'integer-exclusive-maximum',
  schema: {
    type: 'integer',
    maximum: 1,
    exclusiveMaximum: true
  }
});

// ERR_VALUE_INTEGER_MULTIPLE_OF
errorTest('ERR_VALUE_INTEGER_MULTIPLE_OF', 9, {
  name: 'integer-multiple-of',
  schema: {
    type: 'integer',
    multipleOf: 10
  }
});

// ERR_VALUE_BOOLEAN_TYPE
errorTest('ERR_VALUE_BOOLEAN_TYPE', '1', {
  name: 'boolean-type',
  schema: {
    type: 'boolean'
  }
});

// ERR_VALUE_ARRAY_TYPE
errorTest('ERR_VALUE_ARRAY_TYPE', {}, {
  name: 'array-type',
  schema: {
    type: 'array',
    items: {
      type: 'string'
    }
  }
});

// ERR_VALUE_ARRAY_MIN_ITEMS
errorTest('ERR_VALUE_ARRAY_MIN_ITEMS', [1], {
  name: 'array-min-items',
  schema: {
    type: 'array',
    items: {
      type: 'integer'
    },
    minItems: 2
  }
});

// ERR_VALUE_ARRAY_MAX_ITEMS
errorTest('ERR_VALUE_ARRAY_MAX_ITEMS', [1, 2, 3], {
  name: 'array-max-items',
  schema: {
    type: 'array',
    items: {
      type: 'integer'
    },
    maxItems: 2
  }
});

// ERR_VALUE_ARRAY_UNIQUEITEMS
errorTest('ERR_VALUE_ARRAY_UNIQUEITEMS', [1, 2, 2], {
  name: 'array-unique-items',
  schema: {
    type: 'array',
    items: {
      type: 'integer'
    },
    uniqueItems: true
  }
});

// ERR_VALUE_OBJECT_TYPE
errorTest('ERR_VALUE_OBJECT_TYPE', null, {
  name: 'object-type-1',
  schema: {
    type: 'object'
  }
});

errorTest('ERR_VALUE_OBJECT_TYPE', [], {
  name: 'object-type-2',
  schema: {
    type: 'object'
  }
});

// ERR_VALUE_OBJECT_MIN_PROPERTIES
errorTest('ERR_VALUE_OBJECT_MIN_PROPERTIES', { foo: 1, bar: 2 }, {
  name: 'object-min-properties',
  schema: {
    type: 'object',
    minProperties: 3
  }
});

// ERR_VALUE_OBJECT_MAX_PROPERTIES
errorTest('ERR_VALUE_OBJECT_MAX_PROPERTIES', { foo: 1, bar: 2 }, {
  name: 'object-max-properties',
  schema: {
    type: 'object',
    maxProperties: 1
  }
});

// ERR_VALUE_OBJECT_REQUIRED
errorTest('ERR_VALUE_OBJECT_REQUIRED', { foo: 1, bar: 2 }, {
  name: 'object-required',
  schema: {
    type: 'object',
    required: ['foo', 'bar', 'baz']
  }
});

// ERR_VALUE_OBJECT_ADDITIONAL_PROPERTIES
errorTest('ERR_VALUE_OBJECT_ADDITIONAL_PROPERTIES', { foo: 1, bar: 2, baz: 3 }, {
  name: 'object-additional-properties-1',
  schema: {
    type: 'object',
    properties: {
      foo: { type: 'integer' },
      bar: { type: 'integer' }
    },
    additionalProperties: false
  }
});

errorTest('ERR_VALUE_OBJECT_ADDITIONAL_PROPERTIES', { foo: 1, bar: 2, baz: 3 }, {
  name: 'object-additional-properties-1',
  schema: {
    type: 'object',
    properties: {
      foo: { type: 'integer' },
      bar: { type: 'integer' }
    },
    additionalProperties: {
      type: 'string'
    }
  }
});

















console.log('======================================');
console.log('All tests were passed!');
console.log('======================================');

function errorTest(code, val, param) {
  console.log('[' + code + ']')

  const valexp = new ValExp(param);
  if (valexp.test(val)) {
    console.log('NG');
    process.exit();
  } else {
    let error = valexp.error;
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
  }

}
