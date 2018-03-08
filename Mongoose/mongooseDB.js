'use strict';
const Mongoose = require('./Mongoose.js')

module.exports = {
    getDB: getDB,
    init: init,
    getModel: getModel,
    stopAll: stopAll,
    disconnect: disconnect
}

const defaultBuild = {
    Name: null,
    URI: 'mongodb://127.0.0.1/',
    Options: {
        poolSize: 5,
        ssl: false,
        sslCA: null,
        sslCRL: null,
        sslCert: null,
        sslKey: null,
        sslPass: null,
        checkServerIdentity: true,
        autoReconnect: true,
        noDelay: true,
        family: 4,
        keepAlive: 30000,
        connectTimeoutMS: 30000,
        socketTimeoutMS: 360000,
        reconnectTries: 30,
        reconnectInterval: 1000,
        ha: true,
        haInterval: 10000,
        replicaSet: null,
        secondaryAcceptableLatencyMS: 15,
        acceptableLatencyMS: 15,
        connectWithNoPrimary: false,
        authSource: null,
        auth: null,//{user: 'bob', password: 'pass'},
        w: null,
        wtimeout: null,
        j: false,
        forceServerObjectId: false,
        serializeFunctions: false,
        ignoreUndefined: false,
        raw: false,
        promoteLongs: true,
        promoteBuffers: false,
        promoteValues: true,
        bufferMaxEntries: -1,
        readPreference: null,
        domainsEnabled: false,
        pkFactory: null,
        promiseLibrary: null,
        readConcern: null,
        maxStalenessSeconds: null,
        appname: null,
        loggerLevel: null,
        logger: null,
        validateOptions: false
    }
}

const dbList = Object.assign({})
/**
 * @description 
 * @author Justin Mathews
 * @param {any} connectionMeta 
 * @returns 
 */
function _validateInput(connectionMeta) {
    return Object.assign({}, defaultBuild, connectionMeta);
}
/**
 * @description 
 * @author Justin Mathews
 * @param {any} connectionMeta 
 * @returns 
 */
function _connectionInit(connectionMeta) {
    if (!connectionMeta.hasOwnProperty('Name') ||
        !connectionMeta.Name) throw new Error('Unable tp connect to Database');
    let _buildMeta = _validateInput(connectionMeta);
    dbList[_buildMeta.Name] = {};
    dbList[_buildMeta.Name].Meta = _buildMeta;
    dbList[_buildMeta.Name].DB = new Mongoose(_buildMeta);
    return dbList[_buildMeta.Name];
}
/**
 * @description 
 * @author Justin Mathews
 * @param {any} connectionArray 
 * @returns 
 */
function _metaArray(connectionArray) {
    connectionArray.forEach(element => {
        _connectionInit(element);
    });
    return dbList;
}
/**
 * @description 
 * @author Justin Mathews
 * @param {any} connectionMeta 
 * @returns 
 */
function init(connectionMeta) {
    if (!connectionMeta) throw new Error('Unable tp connect to Database');
    let result;
    if (Array.isArray(connectionMeta)) {
        result = _metaArray(connectionMeta)
    } else {
        result = _connectionInit(connectionMeta)
    }
    return result;
}
/**
 * @description 
 * @author Justin Mathews
 * @param {any} name 
 * @returns 
 */
function getDB(name) {
    return _getDB(name)
}
/**
 * @description 
 * @author Justin Mathews
 * @param {any} db 
 * @returns 
 */
function _getDB(db) {
    if (!db ||
        ((typeof db != 'string') &&
            !(db instanceof Mongoose))) throw new Error('Unable to connect to database');
    if ((typeof db === 'string') &&
        ((!dbList.hasOwnProperty(db)) ||
            (!dbList[db].hasOwnProperty('DB')) ||
            (!(dbList[db].DB instanceof Mongoose)))) throw new Error('Unable to connect to database');
    return (typeof db === 'string') ? dbList[db].DB : db;
}
/**
 * @description 
 * @author Justin Mathews
 * @param {any} schema 
 * @param {any} db 
 * @returns 
 */
function _getSchema(schema, db) {
    if ((!schema) ||
        (!(schema instanceof Object) &&
            !(schema instanceof db.Schema))) throw new Error('Unable to build schema Object');
    return (schema instanceof db.Schema) ? schema : db.Schema(schema);
}
/**
 * @description 
 * @author Justin Mathews
 * @param {any} model 
 * @param {any} schema 
 * @param {any} db 
 * @returns 
 */
function _getModel(model, schema, db) {
    if ((!model) ||
        ((typeof model != 'string') &&
            ((model instanceof db.Schema) &&
                !(model.hasOwnProperty('modelName'))))) throw new Error(' a Improper model name provided');
    return (model instanceof db.Schema) ? model : db.model(model, schema);
}
/**
 * @description 
 * @author Justin Mathews
 * @param {any} db 
 * @param {any} schema 
 * @param {any} model 
 * @returns 
 */
function getModel(db, schema, model) {
    let _db = _getDB(db);
    return _getModel(model, _getSchema(schema, _db), _db);
}
/**
 * @description 
 * @author Justin Mathews
 */
function stopAll() {
    let dbNames = Object.keys(dbList);
    for (let i = 0; i < dbNames.length; i++) {
        disconnect(dbNames[i]);
    }
}
/**
 * @description 
 * @author Justin Mathews
 * @param {any} db 
 */
function disconnect(db) {
    if (db) _getDB(db).disconnect();
}

process.on('SIGINT', function () {
    stopAll();
    process.exit(0);
})

