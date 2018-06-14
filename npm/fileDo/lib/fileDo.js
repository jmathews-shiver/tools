'use strict'

const path = require('path')
const fs = require('fs')

module.exports = {
	resolvePath: function resolvePath(filename) {
		if ([undefined, null, ''].includes(filename)) return
		let _path = filename
		_path = path.normalize(_path)
		_path = path.resolve(_path)
		return _path
	},
	getPath: function getPath(filename) {
		let _path = this.resolvePath(filename)
		return path.parse(_path).dir
	},
	isValidFile: function isValidFile(filename) {
		let _obj = path.parse(filename)
		return (_obj.ext === '') ? false : true
	},
	isValidPath: function isValidPath(filename) {
		filename = this.resolvePath(filename)
		let _path = (this.isValidFile(filename)) ? path.parse(filename).dir : filename
		if ([undefined, null, ''].includes(_path)) return false
		let result
		try {
		fs.accessSync(_path, this.fileStatus.exists)
			result = true
		} catch (err) {
			result = false
		} finally {
			return result
		}
	},
	fileStatus: {
		read: fs.constants.R_OK,
		write: fs.constants.W_OK,
		execute: fs.constants.X_OK,
		exists: fs.constants.F_OK
	},
	checkAccess: function checkAccess(filename, level) {	
		level = level || this.fileStatus.exists
		if (level === undefined) throw new TypeError('Invalid level provided')
		if (!(this.isValidPath(filename))) throw new TypeError('Invalid path provided')
		let result
		try {
		fs.accessSync(filename, level)
			result = true
		} catch (err) {
			result = false
		} finally {
			return result
		}
	},
	canExecute: function canExecute(filename) {
		let level = this.fileStatus.execute
		return this.checkAccess(filename, level)
	},
	canWrite: function canWrite(filename) {
		let level = this.fileStatus.write
		return this.checkAccess(filename, level)
	},
	canRead: function canRead(filename) {
		let level = this.fileStatus.read
		return this.checkAccess(filename, level)
	},
	pathExists: function pathExists(filename) {
		let level = this.fileStatus.exist
		return this.checkAccess(filename, level)
	}
}
