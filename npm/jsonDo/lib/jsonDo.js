'use strict'

/**
 * @name JSONDo
 * @author Justin Mathews
 * @version 2.0.0
 * @requires objCheck 
 * @description Prodives a JSON configuration module that allows simply creation and lookup functionality
 * through dot notation 
 */

const objCheck = require('objcheck')
const subLevelKeyDefault = 'args'

/**
 * @method string2Array
 * @requires objCheck
 * @private
 * @description Parses dot '.' deleminated string into an array
 * @param {String} input
 * @returns Array
 */
function string2Array(input) {
    return objCheck.String(input) ? input.replace(/\./g, ',').split(',') : input
}

/**
 * @method validateDestModel
 * @requires objCheck
 * @private
 * @description Validate the build path for the new branch
 * @param {String} destPath  - A dot '.' deliminated string that defines the new JSON branch 
 * @returns true (if valid), Error (if not valid)
 */
function validateDestModel(destPath) {
    if (!objCheck.String(destPath) && !objCheck.Array(destPath)) throw new Error(`JSON model "destPath" must be a dot (.) delimited string representing the JSON path of a new branch ${JSON.stringify(destPath)}`)
    return true
}

/**
 * @name getValue
 * @method getValue
 * @requires objCheck
 * @description parses source object and retrieves value if exists
 * @author Justin Mathews
 * @param {JSON} sourceJSON JSON object containing value
 * @param {string} keyMap Dot '.' delimited string mapping location of value in the source object
 * @returns {*} 
 */
function getValue(sourceJSON, keyMap) {
    if (!objCheck.JSON(sourceJSON)) throw new Error('sourceJSON must be a valid JSON object')
    if (!objCheck.Array(keyMap) && !objCheck.String(keyMap)) throw new Error('keyMap must be a string or array')
    keyMap = (objCheck.Array(keyMap)) ? keyMap : (objCheck.String(keyMap)) ? string2Array(keyMap) : []
    if (objCheck.Array(keyMap) && keyMap.length === 0) return
    sourceJSON = sourceJSON[keyMap.shift()]
    return (keyMap.length > 0) ? getValue(sourceJSON, keyMap) : sourceJSON
}

/**
 * @method buildBranch
 * @requires objCheck
 * @description Creates JSON and assigns value
 * @author Justin Mathews
 * @param {String} keyMap Dot '.' delimited string that maps the JSON hierarchy to by created 
 * @param {*} value Object assigned to the final JSON element
 * @example
 * buildBranch('this.is.a.nested.value', 'example') => {this:{is:{a:{nested:{value: 'example'}}}}}
 * @returns {JSON} Single JSON branch
 */
function buildBranch(keyMap, value) {
    keyMap = (objCheck.Array(keyMap)) ? keyMap : ((objCheck.String(keyMap)) ? string2Array(keyMap) : [])
    if (objCheck.Array(keyMap) && keyMap.length === 0) return
    let _e = keyMap.shift().toString().toLowerCase()
    return Object.assign({}, {
        [_e]: (keyMap.length > 0) ? buildBranch(keyMap, value) : value
    })
}

/**
 * @method mergeDeep
 * @description Merges multilevel JSON object to return a combined result. 
 * @requires objCheck
 * @author Justin Mathews
 * @param {JSON} parentJSON 
 * @param {JSON} newJSON 
 * @returns {JSON} Merged Objects
 * @example A simple merge tha will add an element to a nested JSON object and overwrite another where already exists
 * let source = {a:1, b:{c: 'not bob', d:{age: 42}}}
 * let newJson = {b:{c:'is bob', d:{sex:'male'}}}
 * mergeDeep(source, newJson) => {a:1, b:{c:'is bob', d:{age:42, sex:'male'}}}
 */
function mergeDeep(parentJSON, newJSON) {
    parentJSON = parentJSON || {}
    newJSON = newJSON || {}
    if (!objCheck.JSON(parentJSON)) throw new TypeError('parentJSON must be passed a JSON object')
    if (!objCheck.JSON(newJSON)) throw new TypeError('newJSON must be passed a JSON object')
    Object.keys(newJSON).forEach(key => {
        if (objCheck.JSON(newJSON[key])) {
            if (!(key in parentJSON)) { //this is the start of a new JSON object...add it all
                Object.assign(parentJSON, {
                    [key]: newJSON[key]
                });
            } else { //keep looping until we find a new JSON object
                parentJSON[key] = mergeDeep(parentJSON[key], newJSON[key]);
            }
        } else { //value of element is the last in the line...not JSON 
            Object.assign(parentJSON, {
                [key]: newJSON[key]
            });
        }
    });
    return parentJSON;
}

/**
 * @name crawlJSONForward
 * @method crawlForward
 * @description Process crawls the JSON starting from the beginning moving to the end. The callback is executed at each layer
 * @param {JSON} config Object meeting TYPE configType structure
 * @param {Function} cb Anon function that will be executed for each layer of the JSON processed. Requires a single parameter to allow the current JSON layer to be passed. A "return" is niether required nor desired
 * @param {String} subLevelName Name of element that leads to the next layer. 
 * @param {Number} level (undefined) Value sets the starting position of the hierarchy. 
 * This is primarily used by the process to pass the previous layer depth.  Adds elemeent "level"
 * If undefined, the hierarchy is not mapped
 * @returns {JSON} 
 */
function crawlJSONForward(json, cb, subLevelName, level) {
    if (!objCheck.JSON(json)) throw new TypeError('Must be a JSON')
    if (!objCheck.String(subLevelName)) throw new TypeError('subLevelName must be a string')
    if (!objCheck.Function(cb)) throw new TypeError('Callback must be a function')
    cb.call(this, json)
    let setLevel = (level) ? true : false
    if (setLevel) json.level = level
    if (json.hasOwnProperty(subLevelName)) json[subLevelName].forEach(json => {
        if (setLevel) level++
            crawlJSONForward(json, cb, subLevelName, level)
        if (setLevel) level--
    });
    return json
}

/**
 * @name crawlJSONReverse
 * @method crawlReverse
 * @description Process crawls the JSON starting from the end of each branch moving to the beginning. The callback is executed at each layer
 * @param {JSON} json Object meeting TYPE configType structure
 * @param {Function} cb Anon function that will be executed for each layer of the JSON processed. Requires a single parameter to allow the current JSON layer to be passed. A "return" is niether required nor desired
 * @param {String} subLevelName Name of element that leads to the next layer. 
 * @returns {JSON} JSON object with the desired changes
 */
function crawlJSONReverse(json, cb, subLevelName) {
    subLevelName = (objCheck.Undefined(subLevelName)) ? subLevelKeyDefault : subLevelName
    if (!objCheck.JSON(json)) throw new TypeError('Must be a JSON')
    if (!objCheck.Function(cb)) throw new TypeError('Callback must be a function')
    if (!objCheck.String(subLevelName)) throw new TypeError('subLevelName must be a string')
    if (json.hasOwnProperty(subLevelName)) json[subLevelName].forEach(element => {
        crawlJSONReverse(element, cb, subLevelName)
    });
    cb.call(this, json)
    return json
}

module.exports = {
    // string2Array: string2Array,
    // validateDestModel: validateDestModel,
    getValue: getValue,
    buildBranch: buildBranch,
    mergeDeep: mergeDeep,
    crawlForward: crawlJSONForward,
    crawlReverse: crawlJSONReverse,
    subLevelKeyDefault: subLevelKeyDefault,
}