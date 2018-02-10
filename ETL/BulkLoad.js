'use strict'
const fs = require('fs')
const StreamParser = require('./StreamParser.js');
const defaultjsonArrayLength = 100000;
const defaultDelimiter = null;
var jsonArrayLength;
var json = [];
var out;
var _output

var BulkLoad = {
  init: init,
  run: run,
  pushData: pushData,
  insertMany: toScreen
};

module.exports = BulkLoad;

function init(sourceFile, output, columnMap, delimitor, length) {
  this.sourceFile = sourceFile;
  _output = output;
  this.columnMap = columnMap;
  this.delimitor = delimitor || defaultDelimiter;
  jsonArrayLength = length || defaultjsonArrayLength;
  if (_output.type === 'ORACLE') {
    out = require('./database.js');
    out.init(_output.DBschema, _output.DBtable);
  } else if (_output.type === 'MONGO') {
    out = require('./mongoDB.js');
    out.init(_output.DBdest, _output.DBschema, _output.DBtable);
  }
};

function toScreen(json) {
  console.log(json);
};

function run() {
  //console.log(out);
  StreamParser.init(this.delimitor, this.columnMap);
  let source = fs.createReadStream(this.sourceFile);
  source.pipe(StreamParser);
};

function pushData(feed) {
  //build array of json for mass insert
  json.push(feed);
  if (json.length === jsonArrayLength) {
    //we've reached limit. stop streamming and process
    StreamParser.pause();
    //out ? out.insertMany(_output.DBschema, _output.DBtable, json) : console.log(json);
    out ? out.insertMany(json) : console.log(json);
    json = [];
    StreamParser.resume();
  }
};

StreamParser.on('data', function (feed) {
  BulkLoad.pushData(feed);
});

//trigger end of process
//called before close
StreamParser.on('end', function () {
  out ? out.insertMany(json) : console.log(json);
});

//trigger for error
StreamParser.on('error', function (err) {
  console.log(err);
});

//trigger to close process
StreamParser.on('close', function () {
  console.log('close');
});