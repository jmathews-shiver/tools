'use strict'
var oracledb = require('oracledb');

class OraDB extends require('events') {
    constructor(config) {
        super();
        this.oracledb = oracledb;
        if (config) {
            this.config = config;
            this._openConnections(config);
        };
    };

    _openConnections(connections) {
        this.oracledb.createPool({
            user: connections.user,
            password: connections.password,
            connectString: connections.connectString,
            poolAlias: connections.poolAlias,
            poolMin: connections.poolMin,
            poolMax: connections.poolMax,
            poolIncrement: connections.poolIncrement,
            _enableStats: connections._enableStats
        }, (err, pool) => {
            if (err) throw err;
            this.pool = pool;
            this.emit('connected');
        });
    };

    _getConnection(db) {
        let connection;
        this.getConnection(db)
            .then(conn => { connection = conn; return connection; })
            .catch(err => { throw err });
    };

    _buildInsert(json) {
        let columnList = '';
        let bindList = '';

        Object.keys(json[0]).forEach(key => {
            columnList = (columnList) ? columnList + ',' + key : key;
            bindList = (bindList) ? bindList + ':' + key : key;
        });
        return 'INSERT INTO ' + schema + '.' + table + '(' + columnList + ') VALUES (' + bindList + ')';
    };

    async _closeConnections(conn) {
        return await this.oracledb.getPool(conn).close();
    };

    static async simpleExecutes(connection, statement, binds = [], opts = {}) {
        opts.outFormat = oracledb.OBJECT;
        opts.autoCommit = true;
        let conn = await oracledb.getConnection(connection);
        let results = await conn.execute(statement, binds, opts);
        if (conn && opts.close) await conn.close();
        return results;
    };

    static async insertMany(data, opt) {
        if (!data || !(data instanceof Array)) throw new Error('Unable to process data passed');
        try {
            let _insert = await _buildInsert(data);
            binds.forEach(line => {
                delete line._id;
                simpleExecutes(null, _insert, line, opts);
            });
        } finally {
            _connection.commit();
            _connection.close();
        };
    };

};

module.exports = OraDB;
