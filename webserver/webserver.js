'use strict';
const DefaultErrorCode = 999;

const certs = {
    isServer: true,
    requestCert: true,
    rejectUnauthorized: true,
    pfx: fs.readFileSync('SERVER.pfx'),
    passphrase: 'XXXXX!'
};

class WebServer {
    constructor(ip, port, routes, logger, CORS) {
        this.ip = ip;
        this.port = port;
        this.routes = routes;
        this.logger = logger;
        this.CORS = CORS;
        this.httpServer = this._createServer();
    };

    _createServer() {
        const https = require('http');
        const bodyParser = require('body-parser');
        const helmet = require('helmet');
        const express = require('express');
        let app = express();
        //enable security
        app.use(helmet());
        app.use(bodyParser.urlencoded({ extended: false }));
        // Will parse incoming JSON requests and revive ISO 8601 date strings to
        // instances of Date.
        app.use(bodyParser.json({ reviver: this.reviveDates }));
        // Enable CORS since we want to allow the API to be consumed by domains
        // other than the one the API is hosted from.
        //app.use(this.enableCORS);
        app.use(this._startSession);
        app.use(this._logNewSession(this.logger));
        app.use(this.enableCORS(this.CORS));
        // Mount the router at /api so all routes start with /api
        this._buildRoutes(this.routes);
        // Mount the unexpected error hander last
        app.use(this.handleUnexpectedError(this.logger));
        // httpServer = https.createServer(certs, app);
        app.use(this.closeSession(this.logger));
        // Add an event handler to the connection event of the http server
        // to track open http connections.
        //httpServer.on('connection', this._trackConnection);
        //this.httpServer = https.createServer(certs, app).listen(this.port, this.ip);
        return http.createServer(this.app);
    };

    _trackConnection(conn) {
        const key = conn.remoteAddress + ':' + (conn.remotePort || '');
        openHttpConnections[key] = conn;
        conn.on('close', () => {
            delete openHttpConnections[key];
        });
    };

    _buildRoutes(web, routes) {
        if (!(routes instanceof Array)) throw new Error('not array');
        if (routes.length === 0) throw new Error('array empty');
        routes.forEach(function (value) {
            web.use(value.Path, value.RouterObject);
        });
    };

    _startSession(req, res, next) {
        req.out = {
            sessionID: new Date().getTime(),
            status: DefaultErrorCode,
            message: "System error",
            token: undefined,
            payload: {}
        };
        next();
    };

    _logNewSession(logger) {
        return (req, res, next) => {
            logger.info({ sessionStart: req });
            next();
        };
    };

    start() {
        this.httpServer.listen(this.port, this.ip);
    };

    closeSession(logger) {
        return (req, res, next) => {
            if (req.out.status === 999) req.out.status = 200;
            this.logger.info('close');//{ err: err });
            res.status(req.out.status).json(req.out);
            next();
        };
    };

    handleUnexpectedError(logger) {
        return (err, req, res, next) => {
            try {
                req.out.status = err.status;
                req.out.message = err.message;
            } catch (err) {
                console.log(err)
                req.out.status = 500;
                req.out.message = "System error";
            } finally {
                logger.info({ sessionError: err }, req.out.sessionID);
                next();
            };
        };
    };

    reviveDates(key, value) {
        const dateTimeRegExp = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;
        return (typeof value === 'string' && dateTimeRegExp.test(value)) ? new Date(value) : value;
    };

    enableCORS(CORS) {
        if (CORS === undefined) { console.log('no cors'); return };
        if (!(CORS instanceof Array)) throw new Error('not array');
        if (CORS.length === 0) { console.log('empty cors'); return };
        return (req, res, next) => {
            CORS.forEach(function (value) {
                res.header(value.Name, value.Value);
            });
            next();
        };
    };

    stop() {
        this.httpServer.close
    };
};


module.exports = WebServer;
module.exports.start = WebServer.start;
module.exports.stop = WebServer.stop;
