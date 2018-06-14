'use strict'

/**
 * @name BunyanDo
 * @description Extend Bunyan logger
 * @class BunyanDo
 * @extends {LoggerITF}
 * @requires LoggerITF
 * @requires objcheck
 * @requires filedo
 * @requires bunyan
 */

const fileTypes = {
	console: 'stream',
	consoleLog: 'stream console',
	consoleLogError: 'stream console error',
	file: 'file',
	rotatingFile: 'rotating-file',
	raw: 'raw'
}

const objIs = require('objcheck')
const fileDo = require('filedo')
const Logger = require('bunyan')
const LoggerITF = require('loggeritf')

const BunyanDo = module.exports = class BunyanDo extends LoggerITF {
	constructor(options) {
		super()
		this.streamTypes = fileTypes
		this.options = options || {}
		this.nameFromLevel = Logger.nameFromLevel
		this.levelFromName = Logger.levelFromName
		this.name = (typeof this.options.name === 'string') ? this.options.name : 'logger'
		this.level = this.resolveLevel(this.options.level)
		this.serializers = this.setSerializer(this.options.serializer)
		this.streams = this.validateStreams(this.options.streams || this.options.stream)
		this.logger = Logger.createLogger({
			name: this.name,
			level: this.level,
			serializers: this.serializers,
			streams: this.streams
		})
	}

	/**
	 * @method getLogger
	 * @description Return the current Bunyan logger
	 * @returns Bunyan Logger
	 */
	getLogger() {
		return this.logger
	}

	/**
	 * @method log
	 * @description Logs message
	 * @param {String} message Message to be logged
	 * @param {String|Number|undefined} level Level that the message will be logged
	 */
	log(message, level) {
		let _lvl = this.resolveLevel(level)
		if (message) this.logger[_lvl](message)
	}

	round(number, precision) {
		let shift = function (number, precision) {
			let numArray = ('' + number).split('e');
			return +(numArray[0] + 'e' + (numArray[1] ? (+numArray[1] + precision) : precision));
		};
		return shift(Math.round(shift(number, +precision)), -precision);
	}
	
	/**
	 * @method resolveLevel
	 * @description Validates input and returns formatted level 
	 * @param {String|Number|undefined} level Level that the message will be logged
	 * @returns {String} Formatted level
	 * @throws {TypeError} if the input does not match any valid level
	 */
	resolveLevel(level) {
		let _level = (level) ? level : 'info'
		if (typeof _level === 'string') {
			_level = _level.toLowerCase()
			if (this.levelFromName[_level] === undefined) throw new TypeError('Invalid log level')
		}
		else if (typeof _level === 'number') {
			_level = this.round(_level, -1)
			_level = this.nameFromLevel[_level]
			if (_level === undefined) throw new TypeError('Invalid log level')
		}
		else {
			 throw new TypeError('Invalid log level')
		}
		return _level
	}

	/**
	 * @method setSerializer
	 * @description Sets logger serializer to the defaults of the logger or overridden by input
	 * @param {undefined|Function} serializer
	 * @returns serializer functions
	 */
	setSerializer(serializer) {
		let result = (typeof serializer === 'function') ? serializer : Logger.stdSerializers
		return result
	}

	/**
	 * @method setFile
	 * @description Review, format path/filename, and return valid path that is writable
	 * @param {String} filename Path and filename for log
	 * @returns Usable path
	 * @throws {TypeError} Path is invalid
	 * @throws {TypeError} Filename is invalid
	 * @throws {TypeError} Path is not writable
	 */
	setFile(filename) {
		if (!fileDo.isValidPath(filename)) throw new TypeError('Invalid filename passed. File name must include a valid file path')
		if (!fileDo.isValidFile(filename)) throw new TypeError('Invalid filename passed. File name must have an extention')
		let _file = fileDo.resolvePath(filename)
		let _path = fileDo.getPath(_file)
		if (!fileDo.canWrite(_path)) throw new Error('Invalid filename passed. Unable to create and write to the file name provided')
		return _file
	}

	/**
	 * @method streamIs
	 * @description Reviews and IDs a stream 
	 * @param {JSON} stream Valid stream format
	 * @returns {String} Stream type 
	 */
	streamIs(stream) {
		if (!stream) return
		if (!objIs.JSON(stream)) throw new TypeError('Invalid Stream element')
		if (stream.hasOwnProperty('type') && [this.streamTypes.consoleLog, this.streamTypes.consoleLogError, this.streamTypes.file, this.streamTypes.rotatingFile, this.streamTypes.raw].includes(stream.type)) return stream.type
		if (stream.hasOwnProperty('path') && (stream.hasOwnProperty('period') || stream.hasOwnProperty('count'))) return this.streamTypes.rotatingFile
		if (stream.hasOwnProperty('path')) return this.streamTypes.file
		if (stream.hasOwnProperty('stream') && stream.stream === process.stdout) return this.streamTypes.consoleLog
		if (stream.hasOwnProperty('stream') && stream.stream === process.stderr) return this.streamTypes.consoleLogError
		if (stream.hasOwnProperty('type') && stream.type === this.streamTypes.console) return this.streamTypes.console
		return undefined
	}

	/**
	 * @method validateStreams
	 * @description Validates a single or Array of streams and returns an array of valid streams. Replaces
	 * 	undefined with consoleLog stream.
	 * @param {undefined|JSON|Array} stream 
	 * @returns {Array} Valid streams
	 */
	validateStreams(stream) {
		let _stream = (stream) ? stream : this.consoleLog()
		let _streamList = (Array.isArray(_stream)) ? _stream : [_stream]
		let logStreams = []
		_streamList.forEach(element => {
			_stream = this.formatStream(element)
			if (_stream) logStreams.push(_stream)
		})
		return logStreams
	}

	/**
	 * @method formatStream
	 * @description Evaluates the input stream and ensures that it meets the format needed
	 * @param {JSON} stream Object that provides defaults subject to this type of stream
	 * @returns {JSON}
	 */
	formatStream(stream) {
		let streamID = this.streamIs(stream)
		let _stream
		switch (streamID) {
			case this.streamTypes.file:
				_stream = this.fileStream(stream)
				break;
			case this.streamTypes.rotatingFile:
				_stream = this.rotatingFileStream(stream)
				break;
			case this.streamTypes.consoleLog:
				_stream = this.consoleLog(stream)
				break;
			case this.streamTypes.consoleLogError:
				_stream = this.consoleError(stream)
				break;
			default:
				break;
		}
		return _stream
	}

	/**
	 * @method consoleLog
	 * @description Creates stream object that supports this type of stream
	 * @param {undefined|JSON} stream Object that provides defaults subject to this type of stream
	 * @returns {JSON} 
	 */
	consoleLog(stream) {
		if (stream && !objIs.JSON(stream)) throw new TypeError('Invalid Stream element')
		stream = (stream) ? stream : {}
		let _stream = {}
		_stream.level = this.resolveLevel(stream.level)
		_stream.stream = process.stdout
		_stream.type = this.streamTypes.console
		return _stream
	}

	/**
	 * @method consoleLog
	 * @description Creates stream object that supports this type of stream
	 * @param {undefined|JSON} stream Object that provides defaults subject to this type of stream
	 * @returns {JSON} 
	 */
	consoleError(stream) {
		if (stream && !objIs.JSON(stream)) throw new TypeError('Invalid Stream element')
		stream = (stream) ? stream : {}
		let _stream = {}
		_stream.level = this.resolveLevel(stream.level)
		_stream.stream = process.stderr
		_stream.type = this.streamTypes.console
		return _stream
	}

	/**
	 * @method fileStream
	 * @description Creates stream object that supports this type of stream
	 * @param {undefined|JSON} stream Object that provides defaults subject to this type of stream
	 * @returns {JSON} 
	 */
	fileStream(stream) {
		if (stream && !objIs.JSON(stream)) throw new TypeError('Invalid Stream element')
		stream = (stream) ? stream : {}
		let _stream = {}
		_stream.level = this.resolveLevel(stream.level)
		_stream.path = this.setFile(stream.path)
		_stream.type = this.streamTypes.file
		return _stream
	}

	/**
	 * @method rotatingFileStream
	 * @description Creates stream object that supports this type of stream
	 * @param {undefined|JSON} stream Object that provides defaults subject to this type of stream
	 * @returns {JSON} 
	 */
	rotatingFileStream(stream) {
		if (stream && !objIs.JSON(stream)) throw new TypeError('Invalid Stream element')
		stream = (stream) ? stream : {}
		let _stream = {}
		_stream.level = this.resolveLevel(stream.level)
		_stream.path = this.setFile(stream.path)
		_stream.type = this.streamTypes.rotatingFile
		_stream.period = (stream.hasOwnProperty('period')) ? stream.period : '1d'
		_stream.count = (stream.hasOwnProperty('count')) ? stream.count : 3
		return _stream
	}

	/**
	 * @method init
	 * @static
	 * @description (Static) Intantiates and returns product without the need to "new"
	 * @returns {Class} Instantiated class
	 * @memberof MemCacheDo
	 */
	static init() {
		return new BunyanDo();
	}
}
