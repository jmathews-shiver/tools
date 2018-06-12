'use strict'

/**  
 * @name moddo
 * @version 1.0.2
 * @author Justin Mathews
 * @requires objcheck
 * @description Validates, Imports, and Executes modules for further processing
*/

const objcheck = require('objcheck')

function callJSON(object, element, method, args) {
    if (element && !objcheck.String(element)) throw new TypeError('JSON element must be a String if passed')
    let _obj = (element) ? object[element] : object
    _obj = (method || args) ? callFunction(_obj, method, args) : _obj
    return _obj
}

function callFunction(object, method, args) {
    let _args = args || []
    if (!objcheck.Function(object)) throw new TypeError('Function or class must be passed')
    if (method && !objcheck.String(method)) throw new TypeError('Method name must be a String if passed')
    if (_args && !objcheck.Array(_args)) throw new TypeError('Method parameters must be passed as an Array if used')
    let _obj = (method) ? (_args.length > 0) ? object[method].apply(this, _args) : object[method].call(this) : (_args.length > 0) ? object.apply(this, _args) : object.call()
    return _obj
}

/**
 * @description Review configurations to resolve and map the build parameters
 * @param {*} input 
 */
function fileProcess(file, element, method, args) {
    let _mod = module.exports.import(file)
    let _obj = _mod
    if (objcheck.JSON(_mod)) _obj = callJSON(_mod, element, method, args)
    if (objcheck.Function(_mod)) _obj = callFunction(_mod, method, args)
    return _obj
}

module.exports = {
    resolve: function resolveFile(path) {
        return require.resolve(path)
    },
    import: function importModule(file) {
        return require(file)
    },
    execute: callFunction,
    call: fileProcess,
}