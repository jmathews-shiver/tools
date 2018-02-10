'use strict'

var TABLE1 = {
  STRUCTURE: {
    PARSE_TYPE: "FIXED",
    SCHEMA: "NODE",
    TABLE_NAME: "TABLE1"
  },
  COLUMNS: {
    COLUMN_1: {
      start: 1,
      end: 5
    },
    COLUMN_2: {
      start: 5,
      end: 7
    },
    COLUMN_3: {
      start: 7,
      end: 82
    },
    COLUMN_4: {
      start: 82,
      end: 119
    },
    COLUMN_5: {
      start: 119,
      end: 120
    }
  }
};

var TABLE2 = {
  STRUCTURE: {
    PARSE_TYPE: "DELIMITER",
    DELIMITER: "|",
    SCHEMA: "NODE",
    TABLE_NAME: "TABLE2"
  },
  COLUMNS: ["COLUMN_1",
    "COLUMN_2",
    "COLUMN_3",
    "COLUMN_4",
    "COLUMN_5"]};
    
let source = './FILE.TXT';
let map = TABLE2;
let destination = null;
let config = {
  chuckSize: 100000,
  xformer: {
    //objectMode: true
  }
};

const BulkLoad = require('./BulkLoad.js');
const bulkLoad = new BulkLoad(source, map, destination, config);
bulkLoad.run();
