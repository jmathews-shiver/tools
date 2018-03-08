'use strict';
const Joi = require('joi');

const DefaultWebConfig = {
    ip: process.env.API_IP || '0.0.0.0',
    port: process.env.API_PORT || 3000,
    certs: {
        pfx: undefined,
        passphrase: undefined
    },
    apiRoutes: undefined,
    systemMiddleware: {
        sessionSecurity: [require('helmet')()],
        sessionLogging: undefined,
        systemCORS: (req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', '*');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            next();
        },
        sessionBodyParser: [
            require('body-parser').urlencoded({
                extended: false
            }),
            require('body-parser').json({
                reviver: (key, value) => {
                    const dateTimeRegExp = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;
                    return (typeof value === 'string' && dateTimeRegExp.test(value)) ? new Date(value) : value;
                }
            })
        ],
        responseFormattor: require('../routes/responseFormattorDefault.js'),
        responseErrorFormattor: require('../routes/errorResponseFormattorDefault.js'),
        healthCheckRoute: require('../routes/healthCheck.js'),
        errorLogging: undefined
    }
};

/**
 * @description 
 * @author Justin Mathews
 * @class Server
 */
class Server {
    constructor(options) {
        let _config = Object.assign(DefaultWebConfig, options);
        let _systemMiddleware = _config.systemMiddleware;

        Joi.validate({
            ip: _config.ip,
            port: _config.port
        }, Joi.object().keys({
            ip: Joi.string().ip(),
            port: Joi.number().min(3000).max(5000)
        }), (err, valid) => {
            if (err) throw err;
            this.ip = valid.ip;
            this.port = valid.port;
        });

        this._buildMiddlewareArray(_systemMiddleware.sessionSecurity); //stage session security middleware
        this._buildMiddlewareArray(_systemMiddleware.sessionLogging); //stage session logging middleware
        this._buildMiddlewareArray(_systemMiddleware.systemCORS); //stage CORS middleware
        this._buildMiddlewareArray(_systemMiddleware.sessionBodyParser); //stage BodyParser middleware
        if (_config.apiRoutes) {
            this._buildMiddlewareArray(_config.apiRoutes)
        } else {
            throw new Error('Unable to build server without user defined endpoints')
        } //stage API routes and throw error if non provided
        this._buildMiddlewareArray(_systemMiddleware.healthCheckRoute); //stage the route used to perform a healthcheck
        this._buildMiddlewareArray(_systemMiddleware.responseFormattor); //stage API response formattor
        this._buildMiddlewareArray(_systemMiddleware.responseErrorFormattor); //stage API Error response formattor
        this.app = require('express')();
        this._loadMiddleware(this.app, this.middleware); //load all staged middleware
        this.server = (this._isHTTPS(_config)) ? require('https').createServer(this.certs, this.app) : require('http').createServer(this.app);
    }

    
    /**
     * @description 
     * @author Justin Mathews
     * @param {any} options 
     * @returns 
     * @memberof Server
     */
    _isHTTPS(options) {
        let _isHTTPS = false;
        if (!options.certs || !options.certs.pfx) return _isHTTPS;
        Joi.validate(options.certs, Joi.object().keys({
            isServer: Joi.boolean().default(true),
            requestCert: Joi.boolean().default(false),
            rejectUnauthorized: Joi.boolean().default(true),
            pfx: Joi.string().required(),
            passphrase: Joi.string().required()
        }), (err, valid) => {
            if (err) throw err;
            this.certs = valid;
            _isHTTPS = true;
        });
        return _isHTTPS;
    }

    /**
     * @description 
     * @author Justin Mathews
     * @param {any} object 
     * @memberof Server
     */
    _buildMiddlewareArray(object) {
        if (!this.middleware) this.middleware = Object.create([]);
        if (object) {
            if (object instanceof Array) {
                object.forEach(element => {
                    if (element.constructor !== Function) throw new Error('Improper middleware value');
                    this.middleware.push(element);
                });
            } else {
                if (object.constructor !== Function) throw new Error('Improper middleware value');
                this.middleware.push(object);
            }
        }
    }

    /**
     * @description 
     * @author Justin Mathews
     * @param {any} server 
     * @param {any} array 
     * @memberof Server
     */
    _loadMiddleware(server, array) {
        if (array instanceof Array) {
            array.forEach(element => {
                // console.log(element); 
                server.use(element);
            });
        }
    }

    /**
     * @description 
     * @author Justin Mathews
     * @memberof Server
     */
    start() {
        this.server.listen(this.port, this.ip, () => {
            // if (err) console.log('bob')
            console.log('Started ' + this.ip + ':' + this.port)
        });
    }

    /**
     * @description 
     * @author Justin Mathews
     * @memberof Server
     */
    stop() {
        this.server.close();
    }
}

module.exports = Server;