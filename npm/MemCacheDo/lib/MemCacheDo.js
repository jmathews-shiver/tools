'use strict';


/**
 * @description Basic in memory cache store
 * @version 1.0.0
 * @class MemCacheDo
 */

var CacheDo = module.exports = class MemCacheDo {
  constructor() {
    this._cache = new Map()
    this._size = 0;
  }

  _del(key) {
    this._cache.delete(key)
  }

  _clearTimeout(key) {
    if (this._cache.has(key)) clearTimeout(this._cache.get(key).timeout);
  }

  /**
   * @method keys
   * @description Returns all keys currently found in cache 
   * @returns {Array}
   * @memberof MemCacheDo
   */
  keys() {
    let _keys = []
    this._cache.forEach((value, key)=>{_keys.push(key) })
    return _keys
  }

  /**
   * @method size
   * @description Returns the number of current key/value pairs in memeory
   * @returns {Number}
   * @memberof MemCacheDo
   */
  size() {
    return this._cache.size;
  }

  /**
   * @method put
   * @description Places key/value pair into memory for a set time and potential set an action to execute 
   * when entry expires 
   * @param {String} key 
   * @param {Object} value 
   * @param {Undefined|Number} time Positive Number of milliseconds that the cached object will remain in memeory prior to aging out
   * @param {Undefined|Function} timeoutCallback Action that will execute when the cached value ages out
   * @returns {Object} Value that was cached
   * @memberof MemCacheDo
   */
  put(key, value, time, timeoutCallback) {
    if (typeof time !== 'undefined' && (isNaN(time) || time <= 0)) throw new Error('Cache timeout must be a positive number');
    if (typeof timeoutCallback !== 'undefined' && typeof timeoutCallback !== 'function') throw new Error('Cache timeout callback must be a function');

    let a = {
      value: value,
      ttl: time + Date.now(),
      timeout: (time) ? setTimeout(function () {
        this._del(key);
        if (timeoutCallback) {
          timeoutCallback(key, value);
        }
      }.bind(this), time) : undefined
    };
    this._cache.set(key, a)
    return value;
  }

  /**
   * @method del
   * @description Deletes cached value by key
   * @param {String} key 
   * @returns {Boolean} If cached value was found and removed
   * @memberof MemCacheDo
   */
  del(key) {
    this._clearTimeout(key)
    return this._cache.delete(key)
  }

  /**
   * @method clear
   * @description Removes all cached values from memory
   * @memberof MemCacheDo
   */
  clear() {
    for (let key of this._cache.keys()){
      this._clearTimeout(key)
    }
    this._cache.clear()
  }

  /**
   * @method get
   * @description Returns cached value based on key provided
   * @param {String} key 
   * @returns {Object} Cached value
   * @memberof MemCacheDo
   */
  get(key) {
    let data = this._cache.get(key);
    if (typeof data === 'undefined') return null
    if (!isNaN(data.ttl) || data.ttl < Date.now()) this._del(key)
    return data.value;
  }

  /**
   * @method init
   * @static
   * @description (Static) Intantiates and returns product without the need to "new"
   * @returns {Class} Instantiated class
   * @memberof MemCacheDo
   */
  static init() {
    return new CacheDo();
  }
}
