'use strict'
// const Joi = require('joi');
// const connectionName = process.env.ORACLE_SID;
// const OraDB = require('../services/OraDB.js');

class Dataprocessor {
    constructor(config) {
        const {
            dataClass,
            connectionName,
            reqBindElement,
            reqResultElement,
            model
        } = config;

        this.dbConfig = {
            database: config.dataClass.getDB(config.connectionName),
            connectionName: config.connectionName,
            query: config.model.query,
            binds: (config.hasOwnProperty('reqBindElement') && config.reqBindElement) ? config.reqBindElement : 'userBinds',
            options: config.dbOptions
        }

        this.resultConfig = {
            reqResultElement: (config.hasOwnProperty('reqResultElement') && config.reqResultElement) ? config.reqResultElement : 'out'
        }

        return (req, res, next) => {
            let _resultConfig = this.resultConfig
            _resultConfig.req = req
            this._collectData(this.dbConfig, this._dataPostProcessor)

            this.dbConfig.database.simpleExecutes(this.dbConfig)
                .then(results => {
                    return this._resultFormatter(results)
                })
                .then(data => {
                    req[this.resultConfig.reqResultElement] = data
                    next();
                })
                .catch((err) => {
                    next(err)
                });
        }
    }
}

module.exports = Dataprocessor