'use strict'
var stream = require('stream')
var xformer = new stream.Transform({
  objectMode: true//,
 // highWaterMark: (500 * 1024)
})
var parser;

xformer.init = function init(delimiter, columnMap) {
  //specify the parser to be used
  if (delimiter === null) {
    parser = require('./Parsers.js').fixed;
  } else{
    parser = require('./Parsers.js').delimiter;
  }
  parser.init(delimiter, columnMap)
};

xformer._transform = function (chunk, encoding, done) {
  //disregard encoding and make a string
  let data = chunk.toString()
  this._lastLineData;

  //combine previos chunck to new
  if (this._lastLineData) data = this._lastLineData + data

  //split combined chunck by carriage return  
  let lines = data.split('\n')
  //maintain incomplete chunck for next pull
  this._lastLineData = lines.splice(lines.length - 1, 1)[0]

  lines.forEach(line => {
    //push data to next stage
    this.push(parser.parse(line));
  });

  //call callback...its required
  done();
}

//left over chunks in stream
xformer._flush = function (done) {
  //if chunks fround at end of stream. push them out
  if (this._lastLineData) this.push(this._lastLineData);
  this._lastLineData = null;
  done();
}

module.exports = xformer