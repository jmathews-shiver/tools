'use strict'

var defaultConfig = {
  objectMode: true
};

class Xformer extends require('stream').Transform {
  constructor(delimiter, map, config) {
    config.objectMode = true; //override to ensure string management
    super(config);
    this._delimiter = delimiter;
    this._map = map;
    this._lastLineData = null;
    this._mapKeys = (map instanceof Array) ? map : Object.keys(map);
    this._parser = (this._delimiter) ? this._parseDelimiter : this._parseFixed;
  };

  _parseDelimiter(line, map, mapKeys) {
    let _line = line.toString();

    let jsonPart = {};
    let _fieldCount = 0;
    let _keys = [];

    mapKeys.forEach(_key => {
      _keys.push(_key);
    });

    _line.split(this._delimiter).forEach(_cell => {
      let _keyName = _keys[_fieldCount];
      jsonPart[_keyName] = _cell.trim();
      _fieldCount++;
    });
    return jsonPart;
  };

  _parseFixed(line, map, mapKeys) {
    let _line = line.toString();
    console.log(_line)
    let jsonPart = {};
    mapKeys.forEach(_key => {
      jsonPart[_key] = _line.substring(map[_key].start, map[_key].end).trim();
    });
    return jsonPart;
  };

  _transform(chunk, encoding, done) {
    let error = null;
    try {
      //disregard encoding and make a string
      let _data = chunk.toString()
      //combine previous chunck to new
      _data = (this._lastLineData) ? this._lastLineData + _data : _data;
      if (_data) {
        //split combined chunck by carriage return  
        let _lines = _data.split('\n')
        //console.log(_lines)
        //maintain incomplete chunck for next pull
        this._lastLineData = _lines.splice(_lines.length - 1, 1)[0]
        console.log(this._lastLineData)
        _lines.forEach(_line => {
          this.push(this._parser(_line, this._map, this._mapKeys));
        });
      };
    } catch (err) {
      error = err
    };
    //call callback...its required
    done(error);
  };

  //left over chunks in stream
  _flush(done) {
    done(null, this._lastLineData);
  };

};

module.exports = Xformer
