'use strict';

class OracleBulkInsert extends require('OraDB.js') {
  constructor(schemaName, tableName) {
    this.schema = schemaName;
    this.table = tableName;
    this.Options = {
      autoCommit: false
    };
    //get connect at init
  }
  /**
   * @description 
   * @author Justin Mathews
   * @param {any} json 
   * @returns 
   * @memberof OracleBulkInsert
   */
  _buildInsert(json) {
    let columnList = '';
    let bindList = '';

    Object.keys(json[0]).forEach(key => {
      columnList = (columnList) ? columnList + ',' + key : key;
      bindList = (bindList) ? bindList + ':' + key : key;
    });
    return 'INSERT INTO ' + schema + '.' + table + '(' + columnList + ') VALUES (' + bindList + ')';
  }
  /**
   * @description 
   * @author Justin Mathews
   * @param {any} connection 
   * @param {any} statement 
   * @param {any} [binds=[]] 
   * @param {any} [opts={}] 
   * @memberof OracleBulkInsert
   */
  _simpleExecute(connection, statement, binds = [], opts = {}) {
    try {
      binds.forEach(line => {
        delete line._id;
        connection.execute(statement, line, opts);
      });
    } finally {
      connection.commit();
      connection.close();
    }
  }
  /**
   * @description 
   * @author Justin Mathews
   * @param {any} connName 
   * @param {any} data 
   * @memberof OracleBulkInsert
   */
  insertMany(connName, data) {
    if (!data || !(data instanceof Array)) throw new Error('Unable to process data passed');
    if (connName && data) _simpleExecute(getConnection(connName), _buildInsert(data), data, this.Options);
  }
}

module.exports = OracleBulkInsert;