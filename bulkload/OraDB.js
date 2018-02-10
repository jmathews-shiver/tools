'use strict'

const defaultConfig = {
    user: null,
    password: null,
    connectString: null,
    poolAlias: null,
    poolMin: 1,
    poolMax: 1,
    poolIncrement: 1,
    _enableStats: true
};

class OraDB extends require('oracledb') {
    constructor() {
        super();
    };

    async createPool(config) {
        return await oracledb.createPool(config);
    };

    getpool(connName) {
        return oracledb.getPool(connName);
    };

    async getPoolConn(pool) {
        return await pool.getConnection();
    };

    async closePool(pool) {
        return await pool.close();
    };

    async closeConn(conn) {
        return await conn.close();
    };

    async getConnection(name) {
        return await getPoolConn(getPool(name));
    };
};


module.exports = OraDB;


