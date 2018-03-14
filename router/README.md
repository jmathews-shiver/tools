# (DC) Express Router modules

[TOC]

# Getting Started

This module supports a dynamic means of creating a route chain quickly and consistently. The router is created by passing an object or array that defines each route in the order of the configuration passed. The controller chain is configured to accept 3 functions: preProcessor, dataProcessor, and postProcessor. An undefined or missing element will result in that call to be skipped.
Any controller can be passed in to the 3 slots, but--for consistency--it is recommended that they be used in the manner described below.

# Usage

Router configuration requires a routerConfig as an object or array 

Object routerConfig with description
```
routerConfig = [{
    method: {
        required: true,
        acceptedValues: ['get', 'put', 'post', 'delete', 'patch', 'all', 'use'],
        description: 'Enpoint method used to respond to request'
    },
    endpoint: {
        required: false,
        acceptedValues: [undefined, (typeof === 'string')],
        description: 'Enpoint method used to respond to request'
    },
    preProcessor: {
        required: false,
        acceptedValues: [undefined, (typeof === 'function')],
        description: 'first function that will be executed in the endpoints call chain This should be limited to a controller that preprocesses and validates input variables.'
    },
    dataProcessor: {
        required: false,
        acceptedValues: [undefined, (typeof === 'function')],
        description: 'second function that will be executed in the endpoints call chain. This should be limited to a controller that collects data'
    },
    postProcessor: {
        required: false,
        acceptedValues: [undefined, (typeof === 'function')],
        description: 'final function that will be executed in the endpoints call chain. This shold be limited to a controller that performs any post data formatting, conversions, and hateoas.'
    }
}]
```

## Example 1

```
let test_func = (req, res, next) => {
    req.out.message = req.out.message.toUpperCase();
    next();
}

routerConfig = {
    method: 'use',
    endpoint: undefined,
    preProcessor: undefined,
    dataProcessor: (req, res, next) => {
        req.out = {
            message: 'hello world';
            next();
        }
    },
    postProcessor: test_func
}

const router = new (require('./router.js'))(routerConfig)
```

**Example Results**

```
require('express').Router().use((req, res, next) => {
        req.out = {
            message: 'hello world';
            next();
        }, (req, res, next) => {
            req.out.message = req.out.message.toUpperCase();
            next();
        })
}
```

**Example Explained**

In place of an array, an object was sent which would result in a single endpoint. The "USE" method was used in conjunction with an "undefined"
route path. This would cause the assigned functions to execute for every call.

When executed, 

* nothing will be processed in the preprocess call
* dataprocess call will add 'hello world' to the request. This is shows an anonymous function being passed
* postprocess calls a named function that will modify 'hello world' -> 'HELLO WORLD'

## Example 2

```
let test_func = (req, res, next) => {
    req.out.message = req.out.message.toUpperCase();
    next();
}

routerConfig = {
        method: 'get',
        endpoint: '/bob',
        preProcessor: (req, res, next) => {
            req.out = req.params.username;
            next();
        }
    },
    dataProcessor: (req, res, next) => {
        req.out = {
            message: 'hello world';
            next();
        }
    },
    postProcessor: test_func
}

const router = new (require('./router.js'))(routerConfig)
```

**Example Results**

```
require('express').Router().get('/bob', {
        req.out.message = req.out.message.toUpperCase();
        next();
    }, (req, res, next) => {
        req.out = {
            message: 'hello world';
            next();
        }, (req, res, next) => {
            req.out.message = req.out.message.toUpperCase();
            next();
        })
}
```

**Example Explained**

In place of an array, an object was sent which would result in a single endpoint. The "GET" method was used in conjunction with a route path "/bob". 

When executed:
 
* preprocess pulls username from the URI parameters and assigns it to an object in req.out
* dataprocess call will add 'hello world' to the req.out object. 
* postprocess calls a named function that will modify 'hello world' -> 'HELLO WORLD'

# Deployment

N/A

# Authors

* **Justin Mathews** - *Initial work* 

# License

This project is licensed under the MIT License 

Copyright 2018 Justin Mathews

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
