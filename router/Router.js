'use strict';
class router {
    constructor(config) {
        this.configArray = this.prepInput(config)
        this.configArray = this.validateInputs(this.configArray)
        return this.buildRoutes(require('express').Router(), this.configArray)
    }
    prepInput(input) {
        if (input instanceof Array && input.length > 0) return
        if (input instanceof Object) return (Object.create([])).push(input)
        throw new Error('Invalid router configutation provided');
    }
    validateInputs(inputArray) {
        const acceptedMethods = ['get', 'put', 'post', 'delete', 'patch', 'all', 'use']
        const nullFunction = function (req, res, next) {
            next()
        }
        let routerArray = Object.create([])
        for (let i = 0; i < inputArray.length; i++) {
            let _inputObject = Object.assign({}, inputArray[i])
            _inputObject.preProcessor = (!_inputObject.hasOwnProperty('preProcessor') || _inputObject.preProcessor === undefined) ? nullFunction : _inputObject.preProcessor
            _inputObject.dataProcessor = (!_inputObject.hasOwnProperty('dataProcessor') || _inputObject.dataProcessor === undefined) ? nullFunction : _inputObject.dataProcessor
            _inputObject.postProcessor = (!_inputObject.hasOwnProperty('postProcessor') || _inputObject.postProcessor === undefined) ? nullFunction : _inputObject.postProcessor
            if (!_inputObject.hasOwnProperty('method') || !acceptedMethods.includes(_inputObject.method)) throw new Error(`Invalid route method provided at postion ${i}`);
            if (_inputObject.hasOwnProperty('endpoint') && !(_inputObject.endpoint === undefined || typeof _inputObject.endpoint === 'string')) throw new Error(`Invalid route endpoint provided at postion ${i}`)
            if (_inputObject.preProcessor !== 'function') throw new Error(`Invalid route Pre Processor provided at postion ${i}`)
            if (_inputObject.dataProcessor !== 'function') throw new Error(`Invalid route Data Processor provided at postion ${i}`)
            if (_inputObject.postProcessor !== 'function') throw new Error(`Invalid route Post Processor provided at postion ${i}`)

            routerArray.push(_inputObject)
        }
        return routerArray
    }
    buildRoutes(router, routerArray) {
        for (let i = 0; i < routerArray.length; i++) {
            router[routerArray[i].method](routerArray[i].endpoint, routerArray[i].preprocessor, routerArray[i].dataCollect, routerArray[i].postProcess);
        }
        return router
    }
}
module.exports = router;