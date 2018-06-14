'use strict'

module.exports = class LoggerITF {
    constructor(){}

	getLogger() {
		throw new Error('Interface answering call.')
	}

	log(message, level) {
		throw new Error('Interface answering call.')
	}

}