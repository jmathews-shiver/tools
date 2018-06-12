'use strict'

/**
 * @name jsonBuildDo
 * @author Justin Mathews
 * @version 1.0.0
 * @requires objCheck
 * @requires jsondo 
 * @requires moddo
 * @description Supports a predefined configuration that extends JSONDo to manage JSON objects in a dynamicly
 */

/**
 * @name configType
 * @description Type defining JSON management instructions
 * @public 
 * @param {JSON} jsonConfig Object containing all values needed 
 * @param {String} jsonConfig.type type Object type that will be found in sourceObject ['static', 'json', 'function']
 * @param {*} jsonConfig.sourceObject Object type passed, must match that defined by "type". Except when type = "static",
 * then the object will be returned as is
 * @param {String|Array|Undefined} jsonConfig.sourcePath This will either be a 
 * (type = 'json') dot '.' delimited string mapping the path to the value
 * (type = 'function') an Array of parameters to pass to the function or Undefined
 * (type = 'static') Undefined - value will be ignored
 * @param {String} jsonConfig.newPath dot '.' delimited string mapping the path to the value
 */


const objCheck = require('objcheck')
const jsondo = require('jsondo')
const moddo = require('moddo')

//validateSourceModel
const typeType = 'type'
const sourceObjectKey = 'sourceObject'
const sourcePathKey = 'sourcePath'
const newPathKey = 'newPath'

//validateSourceModel allowed types
const functionType = 'function'
const jsonType = 'json'
const staticType = 'static'
const fileType = 'file'
const AcceptedConfigTypes = [fileType, staticType, functionType, jsonType]

//inhert values from jsondo
const subLevelKey = jsondo.subLevelKeyDefault

/**
 * @method validateSourceModel
 * @requires objCheck
 * @private
 * @description Validate the instructions to retrieve a value from a source object
 * @author Justin Mathews
 * @param {JSON} model
 *      type - will define what we should expect as the source
 *          "static" - The source object will be a static value and the value will be used as - is -
 *          "json" - The source object will be a JSON object and the needed value will be nested -
 *          "function" - The source object will be a function. The function is expected to be executed in order to find the final value
 *      sourceObject - Object that will be used to provide the finial value. The manner in which it is used is determined by the value set in "Type"
 *      sourcePath - Further information may be needed in order to retrieve a value.
 *          If "type" = "json" this will be a dot '.' deliminated string that defines the path to the source value
 *          If "type" = "function" this will be the parameters used when the function is called.One or values should be passed within an Array.Leave undefined if no parameters are need.
 *          If "type" = "static" then leave undefined since it will not be needed
 *      newPath - Dot '.' deliminated string that defines the path to the new value
 * @returns true (if valid), Error (if not valid)
 */
function validateSourceModel(model) {
    let _model = {
        [typeType]: undefined,
        [sourceObjectKey]: undefined,
        [sourcePathKey]: undefined
    }
    Object.assign(_model, model)
    _model[typeType] = _model[typeType].toLowerCase()
    if (!AcceptedConfigTypes.includes(_model[typeType])) throw new Error(`Invalid "${typeType}" value for JSON model ${_model[typeType]}`)
    if (_model[typeType] === jsonType && !objCheck.JSON(_model[sourceObjectKey])) throw new TypeError(`Invalid "${sourceObjectKey}". Must be a ${JSON.stringify(_model[typeType])}`)
    if (_model[typeType] === jsonType && !objCheck.String(_model[sourcePathKey])) throw new TypeError(`${sourcePathKey} must be a dot "." delimited string since "${typeType}" is defined as JSON`)
    if (_model[typeType] === functionType && !objCheck.Function(_model[sourceObjectKey])) throw new TypeError(`Invalid "${sourceObjectKey}". Must be a ${JSON.stringify(_model[typeType])}`)
    if (_model[typeType] === functionType && (!objCheck.Array(_model[sourcePathKey]) && !objCheck.Undefined(_model[sourcePathKey]))) throw new TypeError(`${sourcePathKey} must be an Array of parameters or undefined`)
    return true
}

/**
 * @method validateNewPath
 * @requires objCheck
 * @private
 * @description Validate the build path for the new branch
 * @author Justin Mathews
 * @param {String} newPath  - A dot '.' deliminated string that defines the new JSON branch 
 * @returns true (if valid), Error (if not valid)
 */
function validateNewPath(newPath) {
    if (!objCheck.String(newPath) && !objCheck.Array(newPath)) throw new Error(`JSON model "${newPathKey}" must be a dot (.) delimited string representing the JSON path of a new branch ${JSON.stringify(newPath)}`)
    return true
}

/**
 * @method getValue(jsonConfig)
 * @returns {any}
 * @description Returns a value based on the configuration passed. This can a static value or one collected from a JSON object
 * or function call 
 * @requires objCheck
 * @requires JSONDo
 * @requires moddo
 * @see configType
 * @param {JSON} jsonConfig Object containing all values needed 
 * @param {String} jsonConfig.type type Object type that will be found in sourceObject ['static', 'json', 'function']
 * @param {*} jsonConfig.sourceObject Object type passed, must match that defined by "type". Except when type = "static",
 * then the object will be returned as is
 * @param {String|Array|Undefined} jsonConfig.sourcePath This will either be a 
 * (type = 'json') dot '.' delimited string mapping the path to the value
 * (type = 'function') an Array of parameters to pass to the function or Undefined
 * (type = 'static') Undefined - value will be ignored
 * @example  Retrieve a STATIC value 
 * getValue('static', 'some value', undefined) => 'some value' * 
 * getValue('static', 'some value') => 'some value'
 * @example  Retrieve a value from JSON
 * getValue('json', {a:{b:1,c:{d:'value here'}}}, 'a.c.d') => 'value here'
 * @example  Retrieve value from function call
 * getValue('function', function bob(){ return 'a value from funtion'}, undefined) => 'a value from funtion'
 * getValue('function', (input)=>{ return input + 10}, [1]) => 11
 * getValue('function', (input1, input2)=>{ return input1 + input2}, [1, 100]) => 101
 * @example Pass configuration in as JSON object instead of individual parameters
 * let json = {type: 'static', sourceObject: 'parameters passed in json', sourcePath: undefined}
 * getValue(json) => 'parameters passed in json'
 */
function getValue(type, sourceObject, sourcePath) {
    let _model = (arguments.length === 1 && objCheck.JSON(arguments[0])) ? arguments[0] : {
        [typeType]: type,
        [sourceObjectKey]: sourceObject,
        [sourcePathKey]: sourcePath
    }
    validateSourceModel(_model)
    let results
    switch (_model[typeType]) {
        case 'json':
            results = jsondo.getValue(_model[sourceObjectKey], _model[sourcePathKey])
            break;
        case functionType:
            results = moddo.execute(_model[sourceObjectKey], undefined, _model[sourcePathKey])
            break;
        default:
            results = _model[sourceObjectKey]
    }
    return results
}

/**
 * @method buildBranch
 * @description Creates a new JSON object based using a dot '.' delimited String and
 * a value is assign after having retrieved it from the location passed
 * @see configType
 * @requires jsondo
 * @param {JSON} jsonConfig A combination of TYPE configType with an additional field "newPath" 
 * @param {String} jsonConfig.type 
 * @param {*} jsonConfig.sourceObject 
 * @param {Sting|Array|Undefined} jsonConfig.sourcePath 
 * @param {String} jsonConfig.newPath A dot '.' delimited string that maps the path of the new JSON object
 * @example Using the same process as shown in getValue, an additional step will be added to define and create a nw JSON object with the value provided
 * let jsonConfig = {type: 'static', sourceObject: 42, newPath: 'answer.to.life.is'}
 * buildBranch(jsonConfig) => {answer: {to: {life: {is: 42}}}}
 * @example Same as above, but the parameters are passed seperately
 * buildBranch('static', 42, undefined, 'answer.to.life.is') => {answer: {to: {life: {is: 42}}}}
 * @returns {JSON} 
 */
function buildBranch(type, sourceObject, sourcePath, newPath) {
    let _type
    let _sourceObject
    let _sourcePath
    let _newPath
    if (arguments.length === 1) {
        let _model = arguments[0]
        _type = (_model.hasOwnProperty(typeType)) ? _model[typeType] : undefined
        _sourceObject = (_model.hasOwnProperty(sourceObjectKey)) ? _model[sourceObjectKey] : undefined
        _sourcePath = (_model.hasOwnProperty(sourcePathKey)) ? _model[sourcePathKey] : undefined
        _newPath = (_model.hasOwnProperty(newPathKey)) ? _model[newPathKey] : undefined
    } else if (arguments.length === 2) {
        _type = jsonType
        _sourceObject = arguments[1]
        _sourcePath = undefined
        _newPath = arguments[0]
    } else if (arguments.length === 4) {
        _type = arguments[0]
        _sourceObject = arguments[1]
        _sourcePath = arguments[2]
        _newPath = arguments[3]
    } else {
        throw new TypeError('Unable to process parameters')
    }

    validateNewPath(_newPath)
    let value = getValue(_type, _sourceObject, _sourcePath)
    return jsondo.buildBranch(_newPath, value)
}

module.exports = {
    validateSourceModel: validateSourceModel,
    // validateNewPath: validateNewPath,
    // callFunction: callFunction,
    getValue: getValue,
    buildBranch: buildBranch,
    AcceptedConfigTypes: AcceptedConfigTypes,
    subLevelKey: subLevelKey,
    fileType: fileType,
    functionType: functionType,
    jsonType: jsonType,
    staticType: staticType,
    typeType: typeType,
    getValueJSON: jsondo.getValue,
    buildBranchJSON: jsondo.buildBranch,
    mergeDeep: jsondo.mergeDeep,
    crawlForward: jsondo.crawlForward,
    crawlReverse: jsondo.crawlReverse,
}
