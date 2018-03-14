'use strict';
const Joi = require('joi');
/**
 * @description 
 * @author Justin Mathews
 * @class Server
 */
class Server {
    constructor(options) {
        options = Object.assign({}, options)
        const defaultMiddlewareConfig = {
            sessionIDHeader: 'X-Unique-ID',
            defaultSessionID: require('uuid/v1')()
        }
        const defaultCORS = {
            orgin: '*',
            methods: '*',
            headers: 'Content-Type, Authorization'
        }
        const DefaultWebConfig = {
            ip: '0.0.0.0',
            port: 3000,
            certs: {
                pfx: undefined,
                passphrase: undefined
            },
            apiRoutes: new(require('./middleware/helloworld.js'))(defaultMiddlewareConfig),
            CORS: {},
            systemMiddleware: {
                sessionSecurity: require('helmet')(),
                sessionPrep: new(require('./middleware/sessionPrepDefault.js'))(defaultMiddlewareConfig),
                sessionOpenLogging: new(require('./middleware/logger.js'))(defaultMiddlewareConfig),
                systemCORS: new(require('./middleware/CORSDefault.js'))(defaultCORS),
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
                responseFormattor: new(require('./middleware/responseFormattorDefault.js'))(defaultMiddlewareConfig),
                responseErrorFormattor: new(require('./middleware/errorResponseFormattorDefault.js'))(defaultMiddlewareConfig),
                healthCheckRoute: new(require('./middleware/healthCheck.js'))(defaultMiddlewareConfig),
                sessionCloseLogging: undefined, //require('./Logger.js').expressSessionEnd(require('./Logger.js').init()),
                responseTimeLogging: undefined //require('./Logger.js').expressSessionEnd(require('./Logger.js').init())
            }
        };
        options.certs = Object.assign({}, DefaultWebConfig.certs, (options.hasOwnProperty('certs')) ? options.certs : {});
        options.CORS = Object.assign({}, DefaultWebConfig.CORS, (options.hasOwnProperty('CORS')) ? options.CORS : {});
        options.systemMiddleware = Object.assign({}, DefaultWebConfig.systemMiddleware, options.systemMiddleware);
        let _config = Object.assign({}, DefaultWebConfig, options);
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
        this._buildMiddlewareArray(_systemMiddleware.sessionPrep); //prepare session metadata
        this._buildMiddlewareArray(_systemMiddleware.sessionOpenLogging); //stage session logging middleware
        this._buildMiddlewareArray(_systemMiddleware.systemCORS); //stage CORS middleware
        this._buildMiddlewareArray(_systemMiddleware.sessionBodyParser); //stage BodyParser middleware
        this._buildMiddlewareArray(_config.apiRoutes); //stage API routes and throw error if non provided
        this._buildMiddlewareArray(_systemMiddleware.healthCheckRoute); //stage the route used to perform a healthcheck
        this._buildMiddlewareArray(_systemMiddleware.responseFormattor); //stage API response formattor
        this._buildMiddlewareArray(_systemMiddleware.responseErrorFormattor); //stage API Error response formattor
        this._buildMiddlewareArray(_systemMiddleware.sessionCloseLogging); //stage session response logger
        this._buildMiddlewareArray(_systemMiddleware.responseTimeLogging); //stage response time logger
        this.app = require('express')();
        this._loadMiddleware(this.app, this.middleware); //load all staged middleware
        this.server = (this._isHTTPS(_config)) ? require('https').createServer(this.certs, this.app) : require('http').createServer(this.app);
    }

    /**
     * @description Determine if HTTPS library will be used by looking at the server certifiactes passed at startup
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
     * @description Compile an array of middleware that will be used 
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
     * @description Enable the middleware that was precompiled
     * @author Justin Mathews
     * @param {any} server 
     * @param {any} array 
     * @memberof Server
     */
    _loadMiddleware(server, array) {
        if (array instanceof Array) {
            array.forEach(element => {
                server.use(element);
            });
        }
    }

    /**
     * @description Start the server
     * @author Justin Mathews
     * @memberof Server
     */
    start() {
        this.server.listen(this.port, this.ip, () => {
            console.log('Started ' + this.ip + ':' + this.port)
        });
    }

    /**
     * @description Stop server
     * @author Justin Mathews
     * @memberof Server
     */
    stop() {
        this.server.close();
    }
}

module.exports = Server;