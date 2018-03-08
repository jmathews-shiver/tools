'use strict';
const oracledb = require('oracledb');

const configDefault = {
    user: process.env.API_DB_USER,
    password: process.env.API_DB_PWD,
    connectString: process.env.ORACLE_SID,
    externalAuth: process.env.API_DB_EXTAUTH || 'true',
    poolAlias: process.env.ORACLE_SID,
    poolMin: process.env.API_DB_POOL_MAX || 1,
    poolMax: process.env.API_DB_POOL_MAX || 2,
    poolIncrement: process.env.API_DB_POOL_INC || 1,
    _enableStats: true
};

const dbList = Object.assign({});

/**
 * @description 
 * @author Justin Mathews
 * @class OraDB
 * @extends {require('events')}
 */
class OraDB extends require('events') {
    constructor(config) {
        super();
        this.oracledb = oracledb;
        this._connectionInit(config);
    }

    /**
     * @description 
     * @author Justin Mathews
     * @param {any} connectionMeta 
     * @returns 
     * @memberof OraDB
     */
    _validateInput(connectionMeta) {
        let config = Object.assign({}, configDefault, connectionMeta);
        config.externalAuth = (config.externalAuth && (config.externalAuth.toLowerCase() === 'true' || config.externalAuth === '1')) ? true : false;
        if (config.externalAuth) {
            delete config.user;
            delete config.password;
        } else {
            delete config.externalAuth;
        }
        return config;
    }

    /**
     * @description 
     * @author Justin Mathews
     * @param {any} connectionMeta 
     * @returns 
     * @memberof OraDB
     */
    _connectionInit(connectionMeta) {
        let _buildMeta = this._validateInput(connectionMeta);
        if (!_buildMeta.hasOwnProperty('connectString') ||
            !_buildMeta.connectString) throw new Error('Database connection string not provided');
        process.env.ORACLE_SID = (process.env.ORACLE_SID) ? process.env.ORACLE_SID : _buildMeta.poolAlias;
        this._openConnections(_buildMeta);
        dbList[_buildMeta.connectString] = {};
        dbList[_buildMeta.connectString].Meta = _buildMeta;
        dbList[_buildMeta.connectString].DB = this;
        return dbList[_buildMeta.connectString];
    }

    /**
     * @description 
     * @author Justin Mathews
     * @param {any} connections 
     * @memberof OraDB
     */
    _openConnections(connections) {
        this.oracledb.createPool(connections, (err, pool) => {
            if (err) throw err;
            this.pool = pool;
            // this.emit('open');
            this.testConnection(connections.poolAlias);
        });
    }

    /**
     * @description 
     * @author Justin Mathews
     * @param {any} db 
     * @memberof OraDB
     */
    _getConnection(db) {
        let connection;
        this.getConnection(db)
            .then(conn => {
                connection = conn;
                return connection;
            })
            .catch(err => {
                throw err;
            });
    }

    // _buildInsert(json) {
    //     let columnList = '';
    //     let bindList = '';

    //     Object.keys(json[0]).forEach(key => {
    //         columnList = (columnList) ? columnList + ',' + key : key;
    //         bindList = (bindList) ? bindList + ':' + key : key;
    //     });
    //     return 'INSERT INTO ' + schema + '.' + table + '(' + columnList + ') VALUES (' + bindList + ')';
    // }

    /**
     * @description 
     * @author Justin Mathews
     * @param {any} conn 
     * @returns 
     * @memberof OraDB
     */
    async _closeConnections(conn) {// jshint ignore:line
        return await this.oracledb.getPool(conn).close();// jshint ignore:line
    }

    /**
     * @description 
     * @author Justin Mathews
     * @param {any} connection 
     * @param {any} statement 
     * @param {any} binds 
     * @param {any} opts 
     * @returns 
     * @memberof OraDB
     */
    async _simpleExecutes(connection, statement, binds, opts) {// jshint ignore:line
        let _optDefults = {
            outFormat: oracledb.OBJECT,
            autoCommit: true,
            autoClose: true
        };
        let _options = Object.assign(_optDefults, opts)
        let conn = await oracledb.getConnection(connection);// jshint ignore:line
        let results = await conn.execute(statement, binds, _options);// jshint ignore:line
        if (conn && _options.autoClose) await conn.close();// jshint ignore:line
        return results;
    }

    /**
     * @description 
     * @author Justin Mathews
     * @param {any} connection 
     * @param {any} statement 
     * @param {any} [binds=[]] 
     * @param {any} [opts={}] 
     * @param {any} done 
     * @returns 
     * @memberof OraDB
     */
    simpleExecutes(connection, statement, binds = [], opts = {}, done) {// jshint ignore:line
        let _promise = this._simpleExecutes(connection, statement, binds, opts);
        if (done) {
            _promise.then(result => done(null, result)).catch(err => done(err, null));
        } else {
            return _promise
        }
    }

    /**
     * @description 
     * @author Justin Mathews
     * @param {any} connection 
     * @memberof OraDB
     */
    testConnection(connection) {
        let _sql = 'select 1 from dual';
        try {
            this.simpleExecutes(connection, _sql, [], {
                close: true
            }, (err, res) => {
                if (err) {
                    this.emit('dbTestFailed', err);
                    throw err;
                }

                if (res) this.emit('open', res);
            })
        } catch (err) {
            this.emit('dbTestFailed');
        }
    }

    /**
     * @description 
     * @author Justin Mathews
     * @static
     * @returns 
     * @memberof OraDB
     */
    static getDBList() {
        return dbList;
    }

    /**
     * @description 
     * @author Justin Mathews
     * @static
     * @param {any} db 
     * @returns 
     * @memberof OraDB
     */
    static getDB(db) {
        if (!db ||
            ((typeof db != 'string') &&
                !(db instanceof OraDB))) throw new Error('Unable to return db pool instance');
        if ((typeof db === 'string') &&
            ((!dbList.hasOwnProperty(db)) ||
                (!dbList[db].hasOwnProperty('DB')) ||
                (!(dbList[db].DB instanceof OraDB)))) throw new Error('Unable to return db pool instance');
        return (typeof db === 'string') ? dbList[db].DB : db;
    }

    // static async insertMany(data, opt) {// jshint ignore:line
    //     if (!data || !(data instanceof Array)) throw new Error('Unable to process data passed');
    //     try {
    //         let _insert = await _buildInsert(data);// jshint ignore:line
    //         binds.forEach(line => {
    //             delete line._id;
    //             simpleExecutes(null, _insert, line, opts);
    //         });
    //     } finally {
    //         _connection.commit();// jshint ignore:line
    //         _connection.close();// jshint ignore:line
    //     }
    // }
}

module.exports = OraDB;