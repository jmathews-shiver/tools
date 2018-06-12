'use strict'

const objectsValidationList = {
    Number: ['[object Number]'],
    String: ['[object String]'],
    Array: ['[object Array]'],
    JSON: ['[object JSON]'],
    Boolean: ['[object Boolean]'],
    Date: ['[object Date]'],
    NamedFunction: ['[function Raw]'],
    AnonFunction: ['[function Raw]'],
    RawFunction: ['[function Raw]'],
    ArrowFunction: ['[function Arrow]'],
    RawClass: ['[class Raw]'],
    NewFunction: ['[function Instantiated]'],
    NewClass: ['[class Instantiated]'],
    Function: ['[function Arrow]', '[function Raw]', '[class Raw]', '[class Instantiated]'],
    Class: ['[class Raw]', '[class Instantiated]'],
    Error: ['[object Error]'],
    Symbol: ['[object Symbol]'],
    Promise: ['[object Promise]'],
    Set: ['[object Set]'],
    Undefined: ['[object Undefined]'],
    Null: ['[object Null]'],
    Empty: ['[object Undefined]', '[object Null]'],
    Map: ['[object Map]'],
    Generator: ['[object GeneratorFunction]']
}

function checkIs(typeName, objectType) {
    return objectsValidationList[typeName].includes(objectType)
}

function objectType(object) {
    let result = 'unknown'
    if (Object.prototype.toString.call(object) === '[object Function]' &&
        Object.create(object).constructor.toString().includes('function Function()', 0) &&
        Object.keys(Object.getOwnPropertyDescriptors(object)).length > 0) {
        if (Object.getOwnPropertyDescriptor(object, 'prototype')) {
            if (Object.getOwnPropertyDescriptor(object, 'prototype').writable) {
                result = objectsValidationList.NamedFunction[0]
            } else {
                result = objectsValidationList.RawClass[0]
            }
        } else {
            result = objectsValidationList.ArrowFunction[0]
        }
    } else if (Object.prototype.toString.call(object) === '[object Object]') {
        if (Object.create(object).constructor.toString().includes('function Object()', 0)) {
            result = objectsValidationList.JSON[0]
        } else if (Object.create(object).constructor.toString().includes('class', 0)) {
            result = objectsValidationList.NewClass[0]
        } else if (Object.create(object).constructor.toString().includes('function', 0)) {
            result = objectsValidationList.NewFunction[0]
        } else {
            result = '[object Unknown]'
        }
    } else {
        result = Object.prototype.toString.call(object)
    }
    return result
}

/**
 * @description assume that a path contains a path seperator and determine if String could be a path
 * @param {*} item 
 * @returns {boolean}
 */
function isPath(item) {
    return (module.exports.String(item) && item.includes(require('path').sep))
}

Object.assign(module.exports, {
    What: objectType,
    Path: isPath
})

Object.keys(objectsValidationList).forEach((method) => {
    Object.assign(module.exports, {
        [method]: function (item) {
            return checkIs(method, objectType(item))
        }
    })
})
