'use strict';
/**
 * @description 
 * @author Justin Mathews
 * @class BulkLoad
 * @extends {require('./StreamParser.js')}
 */
class BulkLoad extends require('./StreamParser.js') {
  constructor(source, map, destination, config) {
    super(map.STRUCTURE.DELIMITER, map.COLUMNS, config.xformer);
    this._source = source;
    this._map = map.COLUMNS;
    this._destination = destination;
    this._config = config;
    this._chunkSize = config.chuckSize || 100000;
    this._collection = [];
    this._sourceStream = this._openInput(this._source);
    this._output = (destination) ? this._openOutput(destination, config.outConfig) : null;

    this.on('data', function (feed) {
      this._pushData(feed);
    });

    //trigger end of process
    //called before close
    this.on('end', () => {
      this._pushDataOut(this._output, this._collection);
      this._collection = [];
    });

    //trigger for error
    this.on('error', function (err) {
      throw err;
    });

    this.on('close', function () {
      console.log('close');
    });
  }
  /**
   * @description 
   * @author Justin Mathews
   * @memberof BulkLoad
   */
  run() {
    //console.log(this)
    this._sourceStream.pipe(this);
  }
  /**
   * @description 
   * @author Justin Mathews
   * @param {any} object 
   * @param {any} config 
   * @returns 
   * @memberof BulkLoad
   */
  _openOutput(object, config) {
    //chech object exists
    //check config
    return Object.create(object)(config);
  }
  /**
   * @description 
   * @author Justin Mathews
   * @param {any} source 
   * @returns 
   * @memberof BulkLoad
   */
  _openInput(source) {
    //check if file
    //check if file exists
    //return stream 
    //console.log(require('fs').createReadStream(source))
    return require('fs').createReadStream(source);
  }
  /**
   * @description 
   * @author Justin Mathews
   * @param {any} output 
   * @param {any} data 
   * @memberof BulkLoad
   */
  _pushDataOut(output, data) {
    //output ? output.insertMany(_output.DBschema, _output.DBtable, data) : toScreen(data);
    output ? output.insertMany(data) : this._toScreen(data);
  }
  /**
   * @description 
   * @author Justin Mathews
   * @param {any} feed 
   * @memberof BulkLoad
   */
  _pushData(feed) {
    this.pause();
    this._collection.push(feed);
    if (this._collection.length >= this._chunkSize) {
      _pushDataOut(this._output, this._collection);
      this._collection = []
    };
    this.resume();
  }
  /**
   * @description 
   * @author Justin Mathews
   * @param {any} data 
   * @memberof BulkLoad
   */
  _toScreen(data) {
    data.forEach(element => {
      console.log(element);
    });
  }
}

module.exports = BulkLoad;