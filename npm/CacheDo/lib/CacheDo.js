'use strict'

/**
 * @class CacheDo
 * @name CacheDo
 * @version 1.0.0
 * @description Cache abstraction that supports merging cached values with new and key hashing
 * @requires jsondo
 * @requires crypto
 * @param {Class} cacheClass Caching class with get, put, del methods
 * @param {JSON} options Class operation definition
 * @param {Boolean} options.merge (false) Enable/Disable merging new value with present value if one exists
 * @param {JSON} options.keys Defines options specific to key management
 * @param {Boolean} options.keys.hashKey (false) Enable/Disable key hashing
 * @param {String} options.keys.algorithm (sha256) Defines algorith used during key hash
 * @param {String} options.keys.digest (hex) Defines digest used during key hash
 * @param {Function} options.keys.keyGen ((input)=>{return input}) Custom function to produce key
 * @param {Number} options.ttl (600) Define expire time of the cached value
 * @param {Undefined|Function} options.timeoutCB (Undefined) Custom callback function to be executed when cache value expires
 */

const jsondo = require('jsondo')
const crypto = require('crypto')
const objis = require('objcheck')

class CacheDo {
    constructor(cacheClass, options) {
        this.cacheClass = this.setCache(cacheClass)
        this.options = this.setOptions(options)
        this.keyGen = this.setKey(this.options)
    }

    /**
     * @method setCache
     * @description Validates caching function by ensuring that it contains methods
     * get, put, del
     * @param {Function} cacheClass Caching function  
     * @memberof CacheDo
     */
    setCache(cacheClass) {
        const _requiredMethods = ['get', 'put', 'del']
        if (!cacheClass || !_requiredMethods.every(key => {
                return Object.getOwnPropertyNames(Object.getPrototypeOf(cacheClass)).includes(key)
            })) throw new TypeError(`cache class must support method calls to ${_requiredMethods.toString()}`)
        return cacheClass
    }

    /**
     * @method setOptions
     * @description Merges and returns a validated option set
     * @param {JSON} options Class operation definition
     * @param {Boolean} options.merge (false) Enable/Disable merging new value with present value if one exists
     * @param {JSON} options.keys Defines options specific to key management
     * @param {Boolean} options.keys.hashKey (false) Enable/Disable key hashing
     * @param {String} options.keys.algorithm (sha256) Defines algorith used during key hash
     * @param {String} options.keys.digest (hex) Defines digest used during key hash
     * @param {Function} options.keys.keyGen ((input)=>{return input}) Custom function to produce key
     * @param {Number} options.ttl (600) Define expire time of the cached value
     * @param {Undefined|Function} options.timeoutCB (Undefined) Custom callback function to be executed when cache value expires
     * @memberof CacheDo
     */
    setOptions(options) {
        const defaultOptions = {
            merge: false,
            keys: {
                hashKey: false,
                algorithm: 'sha256',
                digest: 'hex',
                keyGen: (input) => {
                    return input
                }
            },
            ttl: 600,
            timeoutCB: undefined
        }
        if (!objis.Undefined(options) && !objis.JSON(options)) throw new TypeError('options must be passed as a JSON')
        const _allowedDigest = ['hex', 'base64']
        let _options = jsondo.mergeDeep(defaultOptions, options)
        if (!objis.Boolean(_options.merge))throw new TypeError('Option.merge must be a boolean')
        if (!objis.Number(_options.ttl) || _options.ttl < 0) throw new TypeError('Option.ttl must be a positive number')
        if (!(objis.Undefined(_options.timeoutCB) || objis.Null(_options.timeoutCB)) && !objis.Function(_options.timeoutCB)) throw new TypeError('Option.timeoutCB must be a function')
        if (!objis.Function(_options.keys.keyGen)) throw new TypeError('Option.keys.keyGen must be a function')
        if (!objis.String(_options.keys.algorithm)) throw new TypeError('Option.keys.algorithm must be a string')
        if (!_allowedDigest.includes(_options.keys.digest)) throw new TypeError('Option.keys.digest must be an allowed value')
        if (!objis.Boolean(_options.keys.hashKey)) throw new TypeError('Option.keys.hashKey must be a booleran')
        return _options
    }

    /**
     * @method hashKey
     * @description Produces hash of parameter. 
     * @param {Number|String|JSON} input Value to be hashed
     * @param {JSON} options.keys Optional options passed that will override options used during class instantiation
     * @param {String} options.keys.algorithm Defines algorith used during key hash
     * @param {String} options.keys.digest Defines digest used during key hash
     * @memberof CacheDo
     */
    hashKey(input, options) {
        let _options = this.setOptions(options)
        let _value = (typeof input === 'number') ? input.toString() : input
        return crypto.createHash(_options.keys.algorithm).update(_value).digest(_options.keys.digest)
    }

    /**
     * @method setKet
     * @description Generates key based on configuration settings
     * @param {Number|String|JSON} input Value to be hashed
     * @param {JSON} options.keys Optional options passed that will override options used during class instantiation
     * @param {String} options.keys.hashKey Enable/Disable key hashing
     * @param {Function} options.keys.keyGen Custom function to produce key
     * @memberof CacheDo
     */
    setKey(input, options) {
        let _options = this.setOptions(options)
        return (_options.keys.hashKey) ? this.hashKey.call(this, input) : _options.keys.keyGen.call(this, input)
    }

    /**
     * @method put
     * @description Pushes key/value pair to cache
     * @param {String} key 
     * @param {Number|String|JSON} value Value to be cached
     * @param {JSON} options Optional options passed that will override options used during class instantiation
     * @param {String} options.merge Enable/Disable merging new value with present value if one exists
     * @param {String} options.ttl Define expire time of the cached value
     * @param {String} options.timeoutCB Custom callback function to be executed when cache value expires
     * @memberof CacheDo
     */
    put(key, value, options) {
        let _options = this.setOptions(options)
        let _key = this.setKey(key, _options)
        value = (_options.merge) ? jsondo.mergeDeep(this.cacheClass.get(_key), value) : value
        this.cacheClass.put(_key, value, _options.ttl, _options.timeoutCB)
        return value
    }

    /**
     * @method get
     * @description Calls cache to return value assigned to key
     * @param {String} key 
     * @memberof CacheDo
     */
    get(key) {
        return this.cacheClass.get(key)
    }
}

module.exports = CacheDo