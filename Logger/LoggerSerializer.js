'use strict';
/**
 * @description 
 * @author Justin Mathews
 * @param {any} req 
 * @returns 
 */
function sessionStart(req) {
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
 */
function sessionEnd() { }
/**
 * @description 
 * @author Justin Mathews
 */
function sessionError() { }
/**
 * @description 
 * @author Justin Mathews
 */
function systemMessage() { }



module.exports = {
    sessionStart: sessionStart,
    sessionEnd: sessionEnd,
    sessionError: sessionError,
    systemMessage: systemMessage
};