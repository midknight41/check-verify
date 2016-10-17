# check-verify

[![Build Status](https://travis-ci.org/midknight41/check-verify.svg?branch=master)](https://travis-ci.org/midknight41/check-verify) [![Coverage Status](https://coveralls.io/repos/github/midknight41/check-verify/badge.svg?branch=master)](https://coveralls.io/github/midknight41/check-verify?branch=master)
[![Deps](https://david-dm.org/midknight41/check-verify.svg)](https://david-dm.org/midknight41/check-verify#info=dependencies) [![devDependency Status](https://david-dm.org/midknight41/check-verify/dev-status.svg)](https://david-dm.org/midknight41/check-verify#info=devDependencies)

[![NPM](https://nodei.co/npm/check-verify.png?downloads=true)](https://www.npmjs.com/package/check-verify/)

A module for validating function and method parameters with support for deep references using dot notation. Supports throwing errors and rejecting promises.

## Basic Usage

**check-verify** exports two functions: ```thrower``` and ```promiser```. Both return a ```CheckVerify``` object with slightly different behaviour.

### thrower()

The ```thrower()``` function can be used in two ways: *FailFast* mode and *Verify* mode.

*FailFast* mode is enabled by providing an object to the thrower function. If no object is supplied to will default to *Verify* mode. *Verify* mode will wait for ```verify()``` to be called before validating whereas *FailFast* mode with execute the check as they are declared.

A thrower in *Verify* mode can be assigned to a variable and reused.

#### FailFast Mode

```js
const thrower = require("check-verify").thrower;

function addUser(id, person) {

	thrower({ id, person })
		.check("id").is.a.number() // an error will be thrown here
		.check("person.first").is.a.string()
		.check("person.last").is.a.string();

		// do stuff
}

addUser("123", { first: "john", last: "doe"});
```

#### Verify Mode

```js
const thrower = require("check-verify").thrower;

function addUser(id, person) {

	thrower()
		.check("id").is.a.number()
		.check("person.first").is.a.string()
		.check("person.last").is.a.string()
		.verify({ id, person }); // an error will be thrown here

		// do stuff
}

addUser("123", { first: "john", last: "doe"});
```

### promiser()

The ```promiser``` method returns a ```CheckVerify``` object that will reject a promise instead of throwing an error. It does not support *FailFast* mode.

```js
const promiser = require("check-verify").promiser;

function addUser(id, person) {

	return promiser()
		.check("id").is.a.number()
		.check("person.first").is.a.string()
		.check("person.last").is.a.string()
		.verify({ id, person })
		.then(() => {
			// do stuff
		})
		.catch(error => {
			// deal with error
		});

}

addUser("123", { first: "john", last: "doe"});
```
## CheckVerify Syntax and methods

### Supported validations
- boolean
- string
- number
- array
- object
- url

### Additional Grammar
- a
- an
- is
- that

For debugging purposes you can also use ```explain()```:

```js
	const result = thrower()
		.check("id").is.a.number()
		.explain();

		console.log(result);
/*
 [ { field: 'id', tests: [ 'number' ] },
  { field: 'first', tests: [ 'string' ] } ]
*/
```

## Road to v1

- review documentation
- improve keywords for npm search
