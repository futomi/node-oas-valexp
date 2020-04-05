'use strict';
process.env.NODE_OAS_VALEXP_LANG = 'ja';
const ValExp = require('../lib/valexp.js');

// REQUIRED
normalTest('test', {
  name: 'required-string',
  required: true,
  schema: {
    type: 'string'
  }
});

normalTest(1, {
  name: 'required-integer',
  required: true,
  schema: {
    type: 'integer'
  }
});

normalTest(1.1, {
  name: 'required-number',
  required: true,
  schema: {
    type: 'number'
  }
});

normalTest(true, {
  name: 'required-boolean',
  required: true,
  schema: {
    type: 'boolean'
  }
});

normalTest([1, 2], {
  name: 'required-array',
  required: true,
  schema: {
    type: 'array',
    items: { type: 'integer' }
  }
});

normalTest({}, {
  name: 'required-object',
  required: true,
  schema: {
    type: 'object'
  }
});

// ONE_OF
normalTest(0.1, {
  name: 'oneof',
  schema: {
    oneOf: [
      { type: 'number' },
      { type: 'string' }
    ]
  }
});

// ANY_OF
normalTest(1, {
  name: 'anyof',
  schema: {
    anyOf: [
      { type: 'number' },
      { type: 'integer' }
    ]
  }
});

// ALL_OF
normalTest(1, {
  name: 'allof',
  schema: {
    allOf: [
      { type: 'number' },
      { type: 'integer' }
    ]
  }
});

// STRING_TYPE
normalTest('hoge', {
  name: 'string-type',
  schema: {
    type: 'string'
  }
});

// FORMAT_STRING
normalTest('2020-02-28T09:30:01.000+09:00', {
  name: 'string-format-date-time',
  schema: {
    type: 'string',
    format: 'date-time'
  }
});

normalTest('2020-04-05', {
  name: 'string-format-date',
  schema: {
    type: 'string',
    format: 'date'
  }
});

normalTest('23:00:00', {
  name: 'string-format-time',
  schema: {
    type: 'string',
    format: 'time'
  }
});

normalTest('AQID', {
  name: 'string-format-byte',
  schema: {
    type: 'string',
    format: 'byte'
  }
});


// FORMAT_INTEGER
normalTest(-2147483648, {
  name: 'string-format-int32-1',
  schema: {
    type: 'integer',
    format: 'int32'
  }
});

normalTest(2147483647, {
  name: 'string-format-int32-2',
  schema: {
    type: 'integer',
    format: 'int32'
  }
});

normalTest(-9007199254740991, {
  name: 'string-format-int64-1',
  schema: {
    type: 'integer',
    format: 'int64'
  }
});

normalTest(9007199254740991, {
  name: 'string-format-int64-2',
  schema: {
    type: 'integer',
    format: 'int64'
  }
});

// STRING_MIN_LENGTH
normalTest('ab', {
  name: 'string-min-length',
  schema: {
    type: 'string',
    minLength: 2
  }
});

// STRING_MAX_LENGTH
normalTest('ab', {
  name: 'string-max-length',
  schema: {
    type: 'string',
    maxLength: 2
  }
});

// STRING_PATTERN
normalTest('123-4567', {
  name: 'string-pattern-1',
  schema: {
    type: 'string',
    pattern: '^\\d{3}\\-\\d{4}$'
  }
});

normalTest('123-4567', {
  name: 'string-pattern-2',
  schema: {
    type: 'string',
    pattern: /^\d{3}\-\d{4}$/
  }
});

// NUMBER_TYPE
normalTest(1.1, {
  name: 'number-type',
  schema: {
    type: 'number'
  }
});

// NUMBER_MINIMUM
normalTest(1, {
  name: 'number-minimum',
  schema: {
    type: 'number',
    minimum: 1
  }
});

// NUMBER_EXCLUSIVE_MINIMUM
normalTest(1.1, {
  name: 'number-exclusive-minimum',
  schema: {
    type: 'number',
    minimum: 1,
    exclusiveMinimum: true
  }
});

// NUMBER_MAXIMUM
normalTest(1, {
  name: 'number-maximum',
  schema: {
    type: 'number',
    maximum: 1
  }
});

// NUMBER_EXCLUSIVE_MAXIMUM
normalTest(0.99, {
  name: 'number-exclusive-maximum',
  schema: {
    type: 'number',
    maximum: 1,
    exclusiveMaximum: true
  }
});

// NUMBER_MULTIPLE_OF
normalTest(20, {
  name: 'number-multiple-of',
  schema: {
    type: 'number',
    multipleOf: 10
  }
});

// INTEGER_TYPE
normalTest(1, {
  name: 'integer-type',
  schema: {
    type: 'integer'
  }
});

// INTEGER_MINIMUM
normalTest(1, {
  name: 'integer-minimum',
  schema: {
    type: 'integer',
    minimum: 1
  }
});

// INTEGER_EXCLUSIVE_MINIMUM
normalTest(2, {
  name: 'integer-exclusive-minimum',
  schema: {
    type: 'integer',
    minimum: 1,
    exclusiveMinimum: true
  }
});

// INTEGER_MAXIMUM
normalTest(1, {
  name: 'integer-maximum',
  schema: {
    type: 'integer',
    maximum: 1
  }
});

// INTEGER_EXCLUSIVE_MAXIMUM
normalTest(0, {
  name: 'integer-exclusive-maximum',
  schema: {
    type: 'integer',
    maximum: 1,
    exclusiveMaximum: true
  }
});

// INTEGER_MULTIPLE_OF
normalTest(100, {
  name: 'integer-multiple-of',
  schema: {
    type: 'integer',
    multipleOf: 10
  }
});

// BOOLEAN_TYPE
normalTest(false, {
  name: 'boolean-type',
  schema: {
    type: 'boolean'
  }
});

// ARRAY_TYPE
normalTest([], {
  name: 'array-type',
  schema: {
    type: 'array',
    items: {
      type: 'string'
    }
  }
});

// ERR_VALUE_ARRAY_MIN_ITEMS
normalTest([1, 2], {
  name: 'array-min-items',
  schema: {
    type: 'array',
    items: {
      type: 'integer'
    },
    minItems: 2
  }
});

// ARRAY_MAX_ITEMS
normalTest([1, 2], {
  name: 'array-max-items',
  schema: {
    type: 'array',
    items: {
      type: 'integer'
    },
    maxItems: 2
  }
});

// ARRAY_UNIQUEITEMS
normalTest([1, 2, 3], {
  name: 'array-unique-items',
  schema: {
    type: 'array',
    items: {
      type: 'integer'
    },
    uniqueItems: true
  }
});

// OBJECT_TYPE
normalTest({}, {
  name: 'object-type',
  schema: {
    type: 'object'
  }
});

// OBJECT_MIN_PROPERTIES
normalTest({ foo: 1, bar: 2, baz: 3 }, {
  name: 'object-min-properties',
  schema: {
    type: 'object',
    minProperties: 3
  }
});

// OBJECT_MAX_PROPERTIES
normalTest({ foo: 1, bar: 2 }, {
  name: 'object-max-properties',
  schema: {
    type: 'object',
    maxProperties: 2
  }
});

// OBJECT_REQUIRED
normalTest({ foo: 1, bar: 2, baz: 3 }, {
  name: 'object-required',
  schema: {
    type: 'object',
    required: ['foo', 'bar', 'baz']
  }
});

// OBJECT_ADDITIONAL_PROPERTIES
normalTest({ foo: 1, bar: 2, baz: 3 }, {
  name: 'object-additional-properties-1',
  schema: {
    type: 'object',
    properties: {
      foo: { type: 'integer' },
      bar: { type: 'integer' },
      baz: { type: 'integer' }
    },
    additionalProperties: false
  }
});

normalTest({ foo: 1, bar: 2, baz: 3 }, {
  name: 'object-additional-properties-1',
  schema: {
    type: 'object',
    properties: {
      foo: { type: 'integer' },
      bar: { type: 'integer' }
    },
    additionalProperties: {
      type: 'integer'
    }
  }
});


console.log('======================================');
console.log('All tests were passed!');
console.log('======================================');

function normalTest(val, param) {
  console.log('[' + param.name + ']')

  const valexp = new ValExp(param);
  if (valexp.test(val)) {
    console.log('OK');
  } else {
    let error = valexp.error;
    console.log(error.valExpCode);
    console.log(error.valExpName);
    console.log(error.message);
    console.log('NG');
    process.exit();
  }

}
