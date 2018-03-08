'use strict';

const Logger = require('./services/Logger.js');
const OracleDB = require('./services/OraDB.js');
const Server = require('./services/webserver.js');
const OraDB = new OracleDB();

OraDB.on('open', (response) => {
    const WebConfig = {
        systemMiddleware: {
            sessionLogging: Logger
        },
        apiRoutes: []
    };
    const WebServer = new Server(WebConfig);
    WebServer.start();
    // process.on('SIGTERM', () => WebServer.stop());
    // process.on('SIGINT', () => WebServer.stop());

    process.on('uncaughtException', err => {
        WebServer.stop();
        console.log(err);
        throw err;
    });
});