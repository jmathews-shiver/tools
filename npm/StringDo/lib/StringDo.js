'use strict'

const objIs = require('objcheck')

module.exports = {
	isString: function isString(...args) {
		return args.every(objIs.String)
	},
	eq: function eq(passed, expected) {
		return (passed === expected)
	},
	empty: function empty(...args) {
		return args.every(value => {
			return (objIs.Empty(value) ||
				(this.isString.call(this, value) && value.length === 0))
		})
	}
}
