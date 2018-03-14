# (DC) Express server module

[TOC]

# Getting Started

This module supports a dynamic means of creating a HTTP(S) server quickly and consistently. The server is created by passing an object that will override any predefined configurations. 

#Server (class)
The Server class provides abstraction of Express. Configuration is passed, as an object, during class instantiation
##Usage
```
const serverConfig = {}
const server = new (require('server.js'))(serverConfig)
```
##Errors
###Improper middleware value
The middleware provided is not reconized as appropiate middleware format
###Joi Validation
Joi is used to validate certain parameters and will return an error, native to its code, if needed

##start
Start the server listener

 **Usage**
```
const server = require....
server.start()
```

##stop
Stops the server listener

 **Usage**
```
const server = require....
server.stop()
```

#Configuration

## Generic Server Configuration

### IP
* Description - Listening IP 
* Element Name - 'ip'
* Default - '0.0.0.0'
* Object Type - String


 **Usage**
 {ip: '0.0.0.0'}

### PORT
* Description - Listening port
* Default - 3000
* Object Type - Number 


 **Usage**
 {port: 3000}
 
### CERTS
* Description - Enables TLS by passing certificates
* Default - undefined
* Object Type - JSON

**pfx:**
* Default - undefined
* Object Type - String to pfx file location 

**passphrase:**
* Description - password used to open certificate
* Default - undefined
* Object Type - String 

## User Defined Endpoint
### apiRoutes
* Description - A user defined endpoint is required for the server to hold any meaning.
* Default - For testing purposes only, a "hello world" endpoint is added and accessable via '/'
See [apiRoutes](#default-apiRoutes)
* Object Type - Function | Array 


 **Usage**
 ```
 {apiRoutes: (req,res,next)=>{next()}}
 {apiRoutes: require('route_1.js')}
 {apiRoutes: [require('route_1.js'), require('route_2.js'), require('route_3.js')]}
```

## Server Middleware
### sessionSecurity
* Description - Session security module
* Default - See [responseErrorFormatter](#default-sessionSecurity)
* Object Type - Function

### sessionPrep
* Description - Middleware that executes immediately after establishing session security. Its use should be limited to any action needed prior to any other process (i.e. session creation/caching)
* Default - See [responseErrorFormatter](#default-sessionPrep)
* Object Type - Function

### sessionOpenLogging
* Description - Initial session log to persist user request and parameters.
* Default - See [responseErrorFormatter](#default-sessionOpenLogging)
* Object Type - Function

### systemCORS
* Description - Standard CORS middleware 
* Default - See [responseErrorFormatter](#default-systemCORS)
* Object Type - Function

### sessionBodyParser
* Description - Standard body parser middleware
* Default - See [responseErrorFormatter](#default-sessionBodyParser)
* Object Type - Function

### responseFormatter
* Description - Standardizes the format of any response that is not an error
* Default - See [responseErrorFormatter](#default-responseFormatter)
* Object Type - Function

### responseErrorFormatter
* Description - Standardizes the format of any response that is an error
* Default - See [responseErrorFormatter](#default-responseErrorFormatter)
* Object Type - 

### healthCheckRoute
* Description - End point that provides proof that the service is available. This should be replaced with a process that validates database and other required objects
* Default - See [responseErrorFormatter](#default-healthCheckRoute)
* Object Type - Function

### sessionCloseLogging
* Description - Like the sessionOpenLogging, this will be used to log session information, but more specificly in regards to the return message or error.
* Default - undefined
* Object Type - Function

### responseTimeLogging
* Description - This processes should be used to reference cached session info, calculate elapsed execution time, and log the results for metric gathering
* Default - undefined
* Object Type - Function


#Default Middleware
##sessionSecurity
<a name="default-sessionSecurity"></a>
```
require('helmet')()
```

##sessionPrep
<a name="default-sessionPrep"></a>
```
require('express').Router().use((req, res, next) => {
  req.out = Object.assign({}, {
    sessionID: (req.get(config.sessionIDHeader) !== undefined) ? req.get(config.sessionIDHeader) : config.defaultSessionID,
    status: 'System Error',
    statusCode: 500,
    message: 'Route end point not found',
    token: undefined,
    expireIn: undefined
  }, req.out);
  next();
}
```

##sessionOpenLogging
<a name="default-sessionOpenLogging"></a>
```
require('express').Router().use((req, res, next) => {
  let _dt = new Date();
  let _sessionID = (req.out && req.out.sessionID) ? req.out.sessionID : req.get(config.defaultMiddlewareConfig.sessionIDHeader)
  console.log({
    date: _dt,
    server: req.hostname,
    sessionID: _sessionID,
    connectionDetails: {
      address: req.connection.remoteAddress,
      authorized: req.client.authorized,
      authError: req.client.authorizationError,
      encrypted: (req.client.encrypted) ? req.client.encrypted : false,
      protocol: req.protocol,
      clientCert: (req.connection.server.requestCert) ? req.connection.getPeerCertificate() : null
    },
    requestDetails: {
      action: req.method,
      url: req.originalUrl,
      query: req.query,
      params: req.params,
      body: req.body
    }
  });
  next();
}
```
##systemCORS
<a name="default-systemCORS"></a>
```
require('express').Router().use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
}
```

##sessionBodyParser
<a name="default-sessionBodyParser"></a>
```
[
  require('body-parser').urlencoded({
    extended: false
  }),
  require('body-parser').json({
    reviver: (key, value) => {
      const dateTimeRegExp = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;
      return (typeof value === 'string' && dateTimeRegExp.test(value)) ? new Date(value) : value;
    }
  })
]
```

##apiRoutes
<a name="default-apiRoutes"></a>
```
require('express').Router().get('/', (req, res, next) => {
  req.out = {
    sessionID: req.out.sessionID || req.get(config.sessionIDHeader) || config.defaultSessionID,
    payload: 'Hello World'
  }
  return next();
}
```

##responseFormatter
<a name="default-responseFormatter"></a>
```
require('express').Router().use((req, res, next) => {
  if (!req.hasOwnProperty('out')) throw new Error('Route end point not found') //prevent processing if no endpoint. endpoint will create a req.out
  let response = Object.assign({}, {
    sessionID: req.out.sessionID || req.get(config.sessionIDHeader) || config.defaultSessionID,
    status: 'Successful',
    statusCode: 200,
    message: undefined,
    token: (req.out && req.out.token) ? req.out.token : undefined,
    expireIn: (req.out && req.out.expireIn) ? req.out.expireIn : undefined
            }, req.out);
            res.status(response.statusCode).json(response);
            return next();
}
```

##responseErrorFormatter
<a name="default-responseErrorFormatter"></a>
```
require('express').Router().use((err, req, res, next) => {
  let response = Object.assign({}, {
    sessionID: req.out.sessionID || req.get(config.defaultMiddlewareConfig.sessionIDHeader) || config.defaultMiddlewareConfig.defaultSessionID,
    status: (err && err.name) ? err.name : 'System Error',
    statusCode: 400,
    message: (err && err.message) ? err.message : 'System failed due to an internal error',
    token: (req.out && req.out.token) ? req.out.token : undefined,
    expireIn: (req.out && req.out.expireIn) ? req.out.expireIn : undefined
  }, req.out);
  res.status(response.statusCode).json(response);
  return next();
}
```

##healthCheckRoute
<a name="default-healthCheckRoute"></a>
```
require('express').Router().get('/healthcheck', (req, res, next) => {
  req.out = {
    sessionID: req.out.sessionID || req.get(config.sessionIDHeader) || config.defaultSessionID,
    payload: 'Good Health'
  }
  next();
}
```



## Deployment

N/A

## Authors

* **Justin Mathews** - *Initial work* 

## License

This project is licensed under the MIT License 

Copyright 2018 Justin Mathews

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
