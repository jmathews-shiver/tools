'use strict'

class MongoBulkInsert extends require('mongodb').MongoClient {
  constructor(DBdest, DBschema, DBtable) {
    this.DBdest = DBdest;
    this.DBschema = DBschema;
    this.DBtable = DBtable;
  };

  async getDB(URL) {
    return await mongo.connect(URL);
  };

  async closeDBAsync(db) {
    await db.close();
  };

  closeDB(db) {
    if (db) closeDB(db);
  };

  getAll() {
    let db;
    let result;
    try {
      db = getDB(this.DBdest + this.DBschema);
      result = db.collection(this.DBtable).find().toArray();
    } catch (err) {
      throw err;
    } finally {
      closeDB(db);
      return result;
    };
  };

  getOne(searchOption) {
    let db;
    let result;
    try {
      db = getDB(this.DBdest + this.DBschema);
      result = db.collection(this.DBtable).findOne(searchOption);
    } catch (err) {
      throw err;
    } finally {
      closeDB(db);
      return result;
    };
  };

  insertOne(json) {
    let db;
    let result;
    try {
      db = getDB(this.DBdest + this.DBschema);
      result = db.collection(this.DBtable).insert(json);
    } catch (err) {
      throw err;
    } finally {
      closeDB(db);
      return result;
    };
  };

  insertMany(jsonArray) {
    let db;
    let result;
    try {
      db = getDB(this.DBdest + this.DBschema);
      result = db.collection(this.DBtable).insertMany(jsonArray);
    } catch (err) {
      throw err;
    } finally {
      closeDB(db);
      return result;
    };
  };

  updateOne(filter, newDocument, upsert) {
    let _upsert = {};
    let db;
    let result;
    _upsert.upsert = (upsert && upsert === true) ? true : false;

    try {
      db = getDB(this.DBdest + this.DBschema);
      result = db.collection(this.DBtable).updateOne(filter, newDocument, _upsert);
    } catch (err) {
      throw err;
    } finally {
      closeDB(db);
      return result;
    };
  };

  updateMany(filter, newDocument, upsert) {
    let _upsert = {};
    let db;
    let result;
    _upsert.upsert = (upsert && upsert === true) ? true : false;

    try {
      db = getDB(this.DBdest + this.DBschema);
      result = db.collection(this.DBtable).updateMany(filter, newDocument, _upsert);
    } catch (err) {
      throw err;
    } finally {
      closeDB(db);
      return result;
    };
  };

  patchOne(filter, newDocument) {
    let _upsert = {};
    _upsert.upsert = false;

    let updateDocument = {};
    updateDocument.$set = newDocument;

    let db;
    let result;
    try {
      db = getDB(this.DBdest + this.DBschema);
      result = db.collection(this.DBtable).updateOne(this.DBtable, filter, updateDocument, _upsert);
    } catch (err) {
      throw err;
    } finally {
      closeDB(db);
      return result;
    };
  };

  patchAll(filter, newDocument) {
    let _upsert = {};
    _upsert.upsert = false;

    let updateDocument = {};
    updateDocument.$set = newDocument;

    let db;
    let result;
    try {
      db = getDB(this.DBdest + this.DBschema);
      result = db.collection(this.DBtable).updateMany(filter, updateDocument, _upsert);
    } catch (err) {
      throw err;
    } finally {
      closeDB(db);
      return result;
    };
  };
};

module.exports = MongoBulkInsert;
