'use strict';
class router {
    constructor(config) {
        return require('express').Router().use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', config.orgin);
            res.header('Access-Control-Allow-Methods', config.methods);
            res.header('Access-Control-Allow-Headers', config.headers);
            next();
            }
        );
    }
}

module.exports = router