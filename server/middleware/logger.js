'use strict';
class router {
    constructor(config) {
        return require('express').Router().use((req, res, next) => {
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
        );
    }
}

module.exports = router
