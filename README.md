node-oas-valexp
===============

The node-oas-valexp is a value validator using [OAS (OpenAPI Specification) Parameter object](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.3.md#parameterObject). The design is inspired by the [`RegExp`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) object.

Note that this module is *not* a OAS syntax validator. Though it actually validates the syntax internally, its purpose is validating a value following the specified OAS Parameter Object.

## Dependencies

* [Node.js](https://nodejs.org/en/) 10 +

## Installation

```
$ cd ~
$ npm install node-oas-valexp
```

---------------------------------------
## Table of Contents

* [Quick Start](#Quick-Start)
* [`ValExp` object](#ValExp-object)
  * [Creating `ValExp` object](#Creating-ValExp-object)
  * [Properties](#ValExp-properties)
  * [`toString()` method](#ValExp-toString-method)
  * [`test()` method](#ValExp-test-method)
  * [`exec()` method](#ValExp-exec-method)
* [`ValExpExecResult` object](#ValExpExecResult-object) 
* [`ValExpError` object](#ValExpError-object)
* [Supported keywords](#Supported-keywords)
* [Release Note](#Release-Note)
* [References](#References)
* [License](#License)

---------------------------------------
## <a id="Quick-Start">Quick Start</a>

In the sample code below, the function `howOldAreYou()` takes an argument which means your age. It must be an integer in the range of 0 to 120. If `35` is passed to the function, this code will output `Thank you`.

```javascript
const ValExp = require('node-oas-valexp');

howOldAreYou(35);

function howOldAreYou(age) {
  const valexp = new ValExp({
    name: 'age',
    required: true,
    schema: {
      type: 'integer',
      mininum: 0,
      maximum: 120
    }
  });

  if (valexp.test(age)) {
    console.log('Thank you.');
  } else {
    console.log(valexp.error.message);
  }
}
```

As you can see in the code above, a [`ValExp`](#ValExp-object) object (variable `valexp`) is created using the OAS Parameter Object. Then the value passed to the function (variable `age`) is checked by the [`test()`](#ValExp-test-method) method of the [`ValExp`](#ValExp-object) object. The [`test()`](#ValExp-test-method) method returns `true` if the value is valid. Otherwise, it returns `false`.

If `121` is passed to the function, the code above will output the result as follows:

```
The `age` must be less than or equal to 120.
```

If the validation check is failed, you can get the `Error` object from the `valexp.error`. The object is actually a [`ValExpError`](#ValExpError-object) object inherited from the [`Error`](https://nodejs.org/api/errors.html) object.

If you need not only to check the validity but also to get the validated value, you can use the [`exec()`](#ValExp-exec-method) method of the [`ValExp`](#ValExp-object) object. You might wonder how it is going to help. See the scenario below:

```javascript
const ValExp = require('node-oas-valexp');

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
```

In the code above, the function `tellYourProfile()` expects your age and gender. In the Parameter Object, the default value for the gender is defined. If the gender is not passed to the function, the [`exec()`](#ValExp-exec-method) method will automatically set the default value and returns the complete value set. Besides, the returned value is not the reference of the original value, but a newly created value (object).

If the validity check is passed, the [`exec()`](#ValExp-exec-method) method returns a [`ValExpExecResult`](#ValExpExecResult-object) object (the variable `res` in the code above). Otherwise, it returns `null`.

---------------------------------------
## <a id="ValExp-object">`ValExp` object</a>

### <a id="Creating-ValExp-object">Creating `ValExp` object</a>

In order to use this module , you have to get the `ValExp` constructor loading this module as follows:

```JavaScript
const ValExp = require('node-oas-valexp');
```

In the code snippet above, the variable `ValExp` is a `ValExp` constructor. 

In order to check the validity of a value, you have to create a `ValExp` object from the constructor as follows:

```javascript
const valexp = new ValExp({
  name: 'age',
  schema: { type: 'integer' }
});
```

The constructor takes a [OAS Parameter Object](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.3.md#parameterObject). In the code snippet above, the variable `valexp` is a `ValExp` object. If the specified Parameter Object is invalid, the constructor will throw an error. The thrown error is an [`ValExpError`](#ValExpError-object) object.

For now, the `ValExp` constructor does not support JSON/YAML string. You have to parse such string in advance.

### <a id="ValExp-properties">Properties</a>

The `ValExp` object supports some properties as follows:

Property | Type   | Description
:--------|:-------|:----------------------
`source` | String | JSON string representing the specified OAS Parameter Object
`error`  | Object | [`ValExpError`](#ValExpError-object) object or `null`

```javascript
const valexp = new ValExp({
  name: 'age',
  schema: { type: 'integer' }
});
console.log(valexp.source);
```

The code above will output the result as follows:

```
{"name":"age","required":false,"schema":{"type":"integer"}}
```

As you can see the result above, the `source` is not as same as the specified Parameter Object. This module parses the specified Parameter Object and rebuilds an object internally.

The `error` is set to `null` initially. When the [`test()`](#ValExp-test-method) or [`exec()`](#ValExp-exec-method) is called, it will be set to the [`ValExpError`](#ValExpError-object) object if an validation error occurred.

### <a id="ValExp-toString-method">`toString()` method</a>

The `toString()` method returns a JSON string representing the specified Parameter Object. Actually, calling this method is as same as accessing the [`source`](#ValExp-properties) property.

### <a id="ValExp-test-method">`test()` method</a>

The `test()` method validates the specified value following the Parameter Object, then returns the result. If the validation check is passed, it returns `true`. Otherwise, it returns `false`.

See the [Quick Start](#Quick-Start) for more details.

### <a id="ValExp-exec-method">`exec()` method</a>

The `exec()` method validates the specified value following the Parameter Object, then returns the result. If the validation check is passed, it returns a [`ValExpExecResult`](#ValExpExecResult-object) object. Otherwise, it returns `null`.

See the [Quick Start](#Quick-Start) for more details.

---------------------------------------
## <a id="ValExpExecResult-object">`ValExpExecResult` object</a>

The `ValExpExecResult` object has the properties as follows:

Property   | Type   | Description
:----------|:-------|:-------------------------
`0`        | Any    | The value after the validation
`input`    | Any    | The value before the validation

This object is similar to the result of the [`RegExp.prototype.exec()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec) of JavaScript. The `ValExpExecResult` object is actually an object inherited from the `Array`.

```javascript
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

let res = valexp.exec({age: 35});
console.log('- Before: ' + JSON.stringify(res.input));
console.log('- After : ' + JSON.stringify(res[0]));
```

The code above will output the result as follows:

```
- Before: {"age":35}
- After : {"age":35,"gender":"other"}
```

---------------------------------------
## <a id="ValExpError-object">`ValExpError` object</a>

The `ValExpError` is an object inherited from the [`Error`](https://nodejs.org/api/errors.html) object. The `ValExpError` supports the additional properties as follows:

Property     | Type    | Description
:------------|:--------|:------------------------
`valExpName` | String  | Target name whose value has a validation error
`valExpCode` | String  | Error code representing what type of error was found.

```javascript
const ValExp = require('node-oas-valexp');
const valexp = new ValExp({
  name: 'age',
  required: true,
  schema: {
    type: 'integer',
    mininum: 0,
    maximum: 120
  }
});

valexp.test(121); // This couses an validation error

console.log('- valExpName: ' + valexp.error.valExpName);
console.log('- valExpCode: ' + valexp.error.valExpCode);
console.log('- messsage  : ' + valexp.error.message);
```

The code above will output the result as follows:

```
- valExpName: age
- valExpCode: ERR_VALUE_INTEGER_MAXIMUM
- messsage  : The `age` must be less than or equal to 120.
```

The `valExpCode` and the corresponding message are pre-defined in this module. See the [`lib/errors/en.json`](lib/errors/en.json) for details.

For now, this module also supports Japanese error message. If you want to change to Japanese, set the environment variable `process.env.NODE_OAS_VALEXP_LANG` to `"ja"` before loading this module calling the `require()`:

```javascript
process.env.NODE_OAS_VALEXP_LANG = 'ja';
const ValExp = require('node-oas-valexp');
...
```

The code above will output the result as follows:

```
- valExpName: age
- valExpCode: ERR_VALUE_INTEGER_MAXIMUM
- messsage  : `age` は 120 以下でなければいけません。
```

---------------------------------------
## <a id="Supported-keywords">Supported keywords</a>

### `Parameter` object

Property   | Type    | Required | Description
:----------|:--------|:---------|:---------------------
`name`     | String  | Required | Parameter name
`required` | Boolean | Optional | `true`: Required, `false`: Optional (Default)
`schema`   | Object  | Optional | `Schema` object

### `Schema` object

#### Common keywords

Property   | Type    | Required | Description
:----------|:--------|:---------|:---------------------
`oneOf`    | Array   | Optional | List of `Schema` object
`anyOf`    | Array   | Optional | List of `Schema` object
`allOf`    | Array   | Optional | List of `Schema` object
`type`     | String  | Required | `"string"`, `"number"`, `"integer"`, `"boolean"`, `"array"`, or `"object"`
`nullable` | Boolean | Optional | `true`: `null` is acceptable, `false`: `null` is not acceptable (default)

Note that if `oneOf`, `anyOf`, or `allOf` is set, other keywords must not be set.

#### Keywords for `"string"`

Property    | Type    | Required | Description
:-----------|:--------|:---------|:---------------------
`default`   | String  | Optional | Default value
`minLength` | Integer | Optional | It must be grater than 0.
`maxLength` | Integer | Optional | It must be grater than 0.
`format`    | String  | Optional | `"date-time"`, `"date"`, `"time"`, or `"byte"`
`pattern`   | String  | Optional | Regular expression
&nbsp;      | RegExp  | &nbsp;   | &nbsp;

The `format` example:

`format`    | Expected values
:-----------|:------------------
`date-time` | `"2020-04-05T08:30:00.000Z"`, `"2020-04-05T08:30:00.000+09:00"`
`date`      | `"2020-04-05"`
`time`      | `"08:30:00"`, `"08:30:00.000"`

The `date-time` and `date` check if the date actually exists. For example, `"2021-02-29"` will be rejected. 

The `format` does not support `"binary"` for now. If the `format` is `"byte"`, it is expected that the validated value is a base64 string.

The `pattern` allows both of a Regular expression string and a `RegExp` object. The two codes are identical:

```javascript
pattern: '^\\d{3}\\-\\d{4}$'
```

```javascript
pattern: /^\d{3}\-\d{4}$/
```

#### Keywords for `"number"`

Property           | Type    | Required | Description
:------------------|:--------|:---------|:---------------------
`default`          | Number  | Optional | Default value
`minimum`          | Number  | Optional | &nbsp;
`exclusiveMinimum` | Boolean | Optional | The default value is `false` 
`maximum`          | Number  | Optional | &nbsp;
`exclusiveMaximum` | Boolean | Optional | The default value is `false`
`multipleOf`       | Number  | Optional | It must be grater than 0.

#### Keywords for `"integer"`

Property           | Type    | Required | Description
:------------------|:--------|:---------|:---------------------
`default`          | Integer | Optional | Default value
`minimum`          | Number  | Optional | &nbsp;
`exclusiveMinimum` | Boolean | Optional | The default value is `false` 
`maximum`          | Number  | Optional | &nbsp;
`exclusiveMaximum` | Boolean | Optional | The default value is `false`
`multipleOf`       | Number  | Optional | It must be grater than 0.
`format`           | String  | Optional | `"int32"` or `"int64"`

If the `format` is `"int32"`, it is expected that the validated value is in the range of `-2147483648` to `2147483647`.

If the `format` is `"int64"`, it is expected that the validated value is in the range of [`Number.MIN_SAFE_INTEGER`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MIN_SAFE_INTEGER) (`-9007199254740991`) to [`Number.MAX_SAFE_INTEGER`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER) (`9007199254740991`). This module does not support the [`BigInt`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) for now.

#### Keywords for `"boolean"`

Property           | Type    | Required | Description
:------------------|:--------|:---------|:---------------------
`default`          | Boolean | Optional | Default value

#### Keywords for `"array"`

Property           | Type    | Required | Description
:------------------|:--------|:---------|:---------------------
`default`          | Array   | Optional | Default value
`minItems`         | Integer | Optional | It must be equal to or greater than 0.
`maxItems`         | Integer | Optional | It must be equal to or greater than 0.
`uniqueItems`      | Boolean | Optional | The default value is `false`.
`items`            | Object  | Required | `Schema` object for elements in the array.

#### Keywords for `"object"`

Property               | Type    | Required | Description
:----------------------|:--------|:---------|:---------------------
`default`              | Object  | Optional | Default value
`minProperties`        | Integer | Optional | It must be grater than 0.
`maxProperties`        | Integer | Optional | It must be grater than 0.
`required`             | Array   | Optional | The number of elements must be grater than 0.
`properties`           | Object  | Optional | &nbsp;
`additionalProperties` | Boolean | Optional | &nbsp;
&nbsp;                 | Object  | &nbsp;   | &nbsp;

---------------------------------------
## <a id="Release-Note">Release Note</a>

* v0.0.4 (2020-04-10)
  * Fixed the repository url in the `package.json`
* v0.0.3 (2020-04-09)
  * Fixed a bug that the value `undefined` was determined to be invalid even though the `required` in the Parameter Object is set to `false` or not specified
* v0.0.2 (2020-04-05)
  * First public release

---------------------------------------
## <a id="References">References</a>

* [OpenAPI Specification](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.3.md)
* [Swagger Data Models (Schemas)](https://swagger.io/docs/specification/data-models/)
* [JSON Schema Validation](http://json-schema.org/draft/2019-09/json-schema-validation.html)

---------------------------------------
## <a id="License">License</a>

The MIT License (MIT)

Copyright (c) 2020 Futomi Hatano

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
