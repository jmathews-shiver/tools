'use strict';

const _defaultOptions = {
    name: 'default',
    serializers: {},
    streams: [{
        type: 'rotating-file',
        period: '1d', // daily rotation
        count: 3, // keep 3 back copies
        path: '/var/log/' + 'logger.log',
        level: 'trace',
    }]
};

var loggerList;
/**
 * @description 
 * @author Justin Mathews
 * @class Logger
 * @extends {require('bunyan')}
 */
class Logger extends require('bunyan') {
    constructor(options) {
        super(options || _defaultOptions);
        this.serializers = options.serializers;
        let entry = {};
        entry[options.name || _defaultOptions.name] = this;
        loggerList = Object.assign({}, loggerList || {}, entry);
        console.log((_defaultOptions.name))
        console.log(loggerList)
    }
    /**
     * @description 
     * @author Justin Mathews
     * @static
     * @returns 
     * @memberof Logger
     */
    static getDefault() {
        if (!loggerList) return;
        let _name = (loggerList.hasOwnProperty(_defaultOptions.name)) ? _defaultOptions.name : Object.keys(loggerList)[0];
        return loggerList[_name];
    }
    /**
     * @description 
     * @author Justin Mathews
     * @static
     * @param {any} logger 
     * @returns 
     * @memberof Logger
     */
    static getLogger(logger) {
        if (!loggerList) return;
        return (loggerList.hasOwnProperty(logger)) ? loggerList[logger] : undefined;
    }
    /**
     * @description 
     * @author Justin Mathews
     * @returns 
     * @memberof Logger
     */
    listSerializers() {
        return this.serializers;
    }
}


module.exports = Logger;