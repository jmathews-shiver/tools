'use strict';
const bunyan = require('bunyan');

// const options = {
//     name: 'logger',
//     serializers: {
//         sessionStart: this.sessionStart,
//         sessionEnd: this.sessionEnd,
//         sessionError: this.sessionError,
//         systemMessage: this.systemMessage
//     },
//     streams: [{
//         type: 'rotating-file',
//         period: '1d',   // daily rotation
//         count: 3,        // keep 3 back copies
//         path: 'logger.log',
//         level: 'trace',
//     }]
// };
/**
 * @description 
 * @author Justin Mathews
 * @class Logger
 * @extends {require('bunyan')}
 */
class Logger extends require('bunyan') {
    constructor(options) {
        super(options);
    }
    /**
     * @description 
     * @author Justin Mathews
     * @param {any} req 
     * @returns 
     * @memberof Logger
     */
    sessionStart(req) {
        return {
            date: new Date(),
            server: req.hostname,
            sessionID: req.sessionID,
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
        };
    }
    /**
     * @description 
     * @author Justin Mathews
     * @memberof Logger
     */
    sessionEnd() {}
    /**
     * @description 
     * @author Justin Mathews
     * @memberof Logger
     */
    sessionError() {}
    /**
     * @description 
     * @author Justin Mathews
     * @memberof Logger
     */
    systemMessage() {}
}


module.exports = Logger;