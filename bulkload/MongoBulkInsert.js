'use strict';
/**
 * @description 
 * @author Justin Mathews
 * @class MongoBulkInsert
 * @extends {require('mongodb').MongoClient}
 */
class MongoBulkInsert extends require('mongodb').MongoClient {
  constructor(DBdest, DBschema, DBtable) {
    this.DBdest = DBdest;
    this.DBschema = DBschema;
    this.DBtable = DBtable;
  }
  /**
   * @description 
   * @author Justin Mathews
   * @param {any} URL 
   * @returns 
   * @memberof MongoBulkInsert
   */
  async getDB(URL) {// jshint ignore:line
    return await mongo.connect(URL);// jshint ignore:line
  }

  async closeDBAsync(db) {// jshint ignore:line
    await db.close();// jshint ignore:line
  }

  closeDB(db) {
    if (db) this.closeDBAsync(db);
  }
  /**
   * @description 
   * @author Justin Mathews
   * @returns 
   * @memberof MongoBulkInsert
   */
  getAll() {
    let db;
    let result;
    try {
      db = this.getDB(this.DBdest + this.DBschema);
      result = db.collection(this.DBtable).find().toArray();
    } catch (err) {
      throw err;
    } finally {
      this.closeDB(db);
      return result;
    }
  }
  /**
   * @description 
   * @author Justin Mathews
   * @param {any} searchOption 
   * @returns 
   * @memberof MongoBulkInsert
   */
  getOne(searchOption) {
    let db;
    let result;
    try {
      db = this.getDB(this.DBdest + this.DBschema);
      result = db.collection(this.DBtable).findOne(searchOption);
    } catch (err) {
      throw err;
    } finally {
      this.closeDB(db);
      return result;
    }
  }
  /**
   * @description 
   * @author Justin Mathews
   * @param {any} json 
   * @returns 
   * @memberof MongoBulkInsert
   */
  insertOne(json) {
    let db;
    let result;
    try {
      db = this.getDB(this.DBdest + this.DBschema);
      result = db.collection(this.DBtable).insert(json);
    } catch (err) {
      throw err;
    } finally {
      this.closeDB(db);
      return result;
    }
  }
  /**
   * @description 
   * @author Justin Mathews
   * @param {any} jsonArray 
   * @returns 
   * @memberof MongoBulkInsert
   */
  insertMany(jsonArray) {
    let db;
    let result;
    try {
      db = this.getDB(this.DBdest + this.DBschema);
      result = db.collection(this.DBtable).insertMany(jsonArray);
    } catch (err) {
      throw err;
    } finally {
      this.closeDB(db);
      return result;
    }
  }
  /**
   * @description 
   * @author Justin Mathews
   * @param {any} filter 
   * @param {any} newDocument 
   * @param {any} upsert 
   * @returns 
   * @memberof MongoBulkInsert
   */
  updateOne(filter, newDocument, upsert) {
    let _upsert = {};
    let db;
    let result;
    _upsert.upsert = (upsert && upsert === true) ? true : false;

    try {
      db = this.getDB(this.DBdest + this.DBschema);
      result = db.collection(this.DBtable).updateOne(filter, newDocument, _upsert);
    } catch (err) {
      throw err;
    } finally {
      this.closeDB(db);
      return result;
    }
  }
  /**
   * @description 
   * @author Justin Mathews
   * @param {any} filter 
   * @param {any} newDocument 
   * @param {any} upsert 
   * @returns 
   * @memberof MongoBulkInsert
   */
  updateMany(filter, newDocument, upsert) {
    let _upsert = {};
    let db;
    let result;
    _upsert.upsert = (upsert && upsert === true) ? true : false;

    try {
      db = this.getDB(this.DBdest + this.DBschema);
      result = db.collection(this.DBtable).updateMany(filter, newDocument, _upsert);
    } catch (err) {
      throw err;
    } finally {
      this.closeDB(db);
      return result;
    }
  }
  /**
   * @description 
   * @author Justin Mathews
   * @param {any} filter 
   * @param {any} newDocument 
   * @returns 
   * @memberof MongoBulkInsert
   */
  patchOne(filter, newDocument) {
    let _upsert = {};
    _upsert.upsert = false;

    let updateDocument = {};
    updateDocument.$set = newDocument;

    let db;
    let result;
    try {
      db = this.getDB(this.DBdest + this.DBschema);
      result = db.collection(this.DBtable).updateOne(this.DBtable, filter, updateDocument, _upsert);
    } catch (err) {
      throw err;
    } finally {
      this.closeDB(db);
      return result;
    }
  }
  /**
   * @description 
   * @author Justin Mathews
   * @param {any} filter 
   * @param {any} newDocument 
   * @returns 
   * @memberof MongoBulkInsert
   */
  patchAll(filter, newDocument) {
    let _upsert = {};
    _upsert.upsert = false;

    let updateDocument = {};
    updateDocument.$set = newDocument;

    let db;
    let result;
    try {
      db = this.getDB(this.DBdest + this.DBschema);
      result = db.collection(this.DBtable).updateMany(filter, updateDocument, _upsert);
    } catch (err) {
      throw err;
    } finally {
      this.closeDB(db);
      return result;
    }
  }
}

module.exports = MongoBulkInsert;