'use strict'

function isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
}

function string2Array(input) {
    return (typeof input === 'string') ? input.replace(/\./g, ',').split(',') : input
}

function getElementValue(sourceObject, elementArray) {
    let element = elementArray.shift()
    return (elementArray.length > 0) ? getElementValue(sourceObject[element], elementArray) : sourceObject[element]
}

function getValue(sourceObject, model) {
    let {
        src,
        type,
        value
    } = model
    if (src === 'static' && type === 'value') return value //return path as the value if this has been defined as a static value
    if (src === 'header') return sourceObject.get[value] //header is a special case. 
    let _branchKeys = (['params' | 'query' | 'body'].includes(src)) ? string2Array(value).splice(0, 0, src) : string2Array(value)
    if (!(_branchKeys instanceof Array)) throw new Error('Expecting an array of JSON keys that map the desired value')
    return getElementValue(sourceObject, _branchKeys)
}

function buildBranch(elementArray, value) {
    let element = elementArray.shift()
    return Object.assign({}, {
        [element]: (elementArray.length > 0) ? buildBranch(elementArray, value) : value
    })
}

function mergeDeep(parentObject, newObject) {
    if (!(isObject(parentObject) && isObject(newObject))) return
    let result = Object.assign({}, parentObject);
    Object.keys(newObject).forEach(key => {
        if (isObject(newObject[key])) {
            if (!(key in parentObject)) { //this is the start of a new JSON object...add it all
                Object.assign(result, {
                    [key]: newObject[key]
                });
            } else { //keep looping until we find a new JSON object
                result[key] = mergeDeep(parentObject[key], newObject[key]);
            }
        } else { //value of element is the last in the line...not JSON 
            Object.assign(result, {
                [key]: newObject[key]
            });
        }
    });
    return result;
}

function parent(parentObject, sourceObject, modelArray) {
    if (!(isObject(parentObject))) throw new Error('The parent object must be a JSON object') //parentObject has to be a JSON object
    if (!(isObject(sourceObject))) throw new Error('The source object must be a JSON object') //sourceObject has to be a JSON object
    if (!(isObject(modelArray) || !(modelArray instanceof Array))) throw new Error('Model must be a JSON object or array of JSON objects')
    modelArray = (isObject(modelArray)) ? Object.create([]).push(modelArray) : modelArray
    modelArray.forEach(model => {
        if (!(isObject(modelArray))) throw new Error('Model must be a JSON object or array of JSON objects')
        let {
            dst,
            src,
            type,
            value
        } = model
        if (!(['string' | 'json'].includes(type))) throw new Error('Invalid value type for JSON model')
        if (!(['req' | 'params' | 'query' | 'body' | 'header' | 'input' | 'static'].includes(src))) throw new Error('Invalid source type for JSON model')
        if (typeof value !== 'string' || typeof value !== 'number') throw new Error('JSON model value must be a string/number of the hard coded value or a dot (.) delimited path representing the JSON path of the value')
        if (typeof dst !== 'string') throw new Error('JSON model dst must be a dot (.) delimited string representing the JSON path of a new branch')
        let _branchKeys = string2Array(dst)
        if (!(_branchKeys instanceof Array)) throw new Error('Expecting an array of JSON keys that map the desired branch destination')
        mergeDeep(parentObject, buildBranch(_branchKeys, getValue(sourceObject, model)))
    })
}

function expressInterface(config) {
    return (req, res, next) => {
        parent(req, {
            sessionID: (req.get(config.sessionIDHeader) !== undefined) ? req.get(config.sessionIDHeader) : config.defaultSessionID
        }, config.model)
        next();
    }
}

// const sessionIDElement = 'X-Unique-ID';
//     sessionID: req.get(sessionIDElement) || uuidv1()


// let model = [{dst: 'payload,meta,columns', src: 'input', type: 'json', value: 'metadata'},
//             {dst: 'payload.meta.row_count', src: 'input', type: 'length', value: 'rows'},
//             {dst: 'payload.meta.page', src: 'static', type: 'value', value: ''},
//             {dst: 'payload.rows', src: 'static', type: 'value', value: 'rows'},
//             {dst: 'payload.sessionID', src: 'header', type: 'json', value: ''},
//             {dst: 'payload.status', src: 'static', type: 'value', value: '200'},
//             {dst: 'payload.message', src: 'static', type: 'value', value: ''},
//             {dst: 'payload.statusCode', src: 'static', type: 'value', value: ''},
//             {dst: 'payload.token', src: 'req', type: 'json', value: 'out.token'},
//             {dst: 'payload.expireIn', src: 'req', type: 'json', value: 'out.expireIn'}]

// src:req|params|query|body|header|    static|input
// type:json|length|                    value
// value:element|                       ''



// let model = [{
// dst: 'payload,meta,columns',
// src: 'input',
// type: 'json',
// value: 'metadata'
//     },
//     {
// dst: 'payload.meta.row_count',
// src: 'input',
// type: 'length',
// value: 'rows'
//     }
// ]