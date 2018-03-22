'use strict';
class Preprocessor {
    constructor(config) {
        //validate input functions
        const {
            pre,
            validate,
            defaults,
            post
        } = config.model;

        this.reqBindElement = (config.hasOwnProperty('reqBindElement') && config.reqBindElement)? config.reqBindElement : 'userBinds'
        this.validationOptions = {
            abortEarly: false
        }

        this.validater = config.validater
        this.pre = pre
        this.validate = validate
        this.defaults = defaults
        this.post = post

        return (req, res, next) => {
            let _binds = Object.assign({}, req.body, req.params, req.query);
            this._conversion(_binds, this.pre)  //pre converter
            _binds = this._validate(_binds, this.validate, this.validater, this.validationOptions) //validate input values
            _binds = Object.assign({}, _binds, this.defaults) //set defaults
            this._conversion(_binds, this.post)  //post converter
            req[this.reqBindElement] = _binds
            next()
        }
    }

    _validate(binds, model, validater, validaterOptions) {
        let {
            err,
            validatedBinds
        } = validater.validate(binds, model, validaterOptions)
        if (err) throw err
        return validatedBinds
    }

    _conversion(dataSet, action) {
        // action = {columnName: func}
        if (!dataSet || !action) return;
        if (!(action instanceof Object)) throw new Error('Requested conversion is not a valid function');
        if (dataSet && !(dataSet instanceof Object)) throw new Error('Invalid input data type provided');
        let _columnList = Object.keys(action); //get list of colunms from action JSON
        for (let i = 0; i < _columnList.length; i++) { //loop through each column that needs conversion            
            dataSet[_columnList[i]] = action[_columnList[i]](dataSet[_columnList[i]]); //pull function and execute. place converted data back where it came from
        }
    }
}

module.exports = Preprocessor;
