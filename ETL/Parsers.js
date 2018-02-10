'use strict'

var parser = {
  delimiter: {
    init: init,
    parse: parseDelimiter
  },
  fixed: {
    init: init,
    parse: parseFixed
  }
};

function init(delimiter, columnMap) {
  this.map = columnMap;
  this.mapKeys = Object.keys(columnMap);
  this.delimiter = delimiter;
};

function parseDelimiter(line) {
  let _line = line.toString();
  let jsonPart = {};
  let _fieldCount = 0;
  let _keyName;
  let _keys = [];

  this.mapKeys.forEach(_key => {
    _keys.push(_key);
  });

  _line.split(this.delimiter).forEach(_cell => {
    _keyName = _keys[_fieldCount];
    jsonPart[_keyName] = _cell.trim();
    _fieldCount++;
  });
  return jsonPart;
};

function parseFixed(line) {
  let _line = line.toString();
  let jsonPart = {};
  this.mapKeys.forEach(_key => {
    jsonPart[_key] = _line.substring(this.map[_key].start, this.map[_key].end).trim();
  });
  return jsonPart;
};

module.exports = parser;