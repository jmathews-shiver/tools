'use strict'

const objIs = require('objcheck')

module.exports = {
	has(array, value) {
		return array.includes(value)
	},
	empty: function empty(...args) {
		return args.every(value => {
			return (objIs.Empty(value) ||
				(this.isArray.call(this, value) && value.length === 0))
		})
	},
	isArray(...args) {
		return args.every(Array.isArray)
	},
	isSameLength(...args) {
		let _size = args[0].length
		return args.every((array) => {
			return array.length === _size
		})
	},
	eq(...args) {
		let _baseline = args.shift()
		switch (args.length) {
			case 1:
				let _array = args[0]
				return _baseline.every((key) => {
                    let _otherValue = _array.shift()
					return (this.isArray.call(this, key, _otherValue)) ? this.eq.call(this, key, _otherValue) : key === _otherValue
				})
				break;
			case 0:
				return false
				break;
			default:
				return this.eq.apply(this, args)
		}
	}
}
