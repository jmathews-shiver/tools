'use strict';
class Postprocessor {
    constructor(model, baseURL) {
        const {
            convert,
            remove,
            hateoas
        } = model;

        this.convert = convert;
        this.remove = remove;
        this.hateoas = hateoas;
        this.baseURL = baseURL;

        return (req, res, next) => {
            if (!(req.hasOwnProperty('out') && req.out.hasOwnProperty('payload'))) return; //no need to process without data
            let dataSet = req.out.payload
            this._conversion(dataSet, this.convert) //converter
            this._columnRemove(dataSet, this.delete) // remove unneeded columns
            this._hateoasApply(dataSet, this.hateoas, this.baseURL) // add hateoas columns
            next()
        }
    }

    _hateoasApply(dataSet, hateoasInput, baseURL) {
        if (!dataSet || !hateoasInput) return;
        if (dataSet instanceof Array && dataSet.length === 0) return;
        if (!(dataSet instanceof Array || dataSet instanceof Object)) throw new Error('Invalid input data type provided');
        if (!(hateoasInput instanceof Object) || !(hateoasInput instanceof Array)) throw new Error('Requested hateoas is not a valid object or array');

        let _dataArray = Object.create([]);
        if (dataSet instanceof Object) _dataArray.push(dataSet);
        _dataArray = (dataSet instanceof Array && dataSet.length > 0) ? dataSet : _dataArray;

        let _hateoasInputArray = Object.create([]);
        if (hateoasInput instanceof Object) _hateoasInputArray.push(hateoasInput);
        _hateoasInputArray = (hateoasInput instanceof Array && hateoasInput.length > 0) ? hateoasInput : _hateoasInputArray;

        for (let i = 0; i < _dataArray.length; i++) { //loop through data
            let _dataRow = _dataArray[i];
            let _hateoasOutput = Object.assign({});
            let _ref = Object.assign({});
            for (let i = 0; i < _hateoasInputArray.length; i++) { //loop through the hateoas array
                let rowH = _hateoasInputArray[i]
                let nameH = rowH.name
                let bindsH = rowH.binds
                _ref[nameH] = _hateoasInputArray[i].path;
                for (let ia = 0; ia < bindsH.length; ia++) { //loop through each bind variable and change path
                    let _replaceElement = ':' + bindsH;
                    _ref[nameH] = _ref[nameH].replace(_replaceElement, _dataRow[bindsH]);
                    dataSet[i].ref = _ref[nameH];
                }
                dataSet[i].ref = _ref;
            }
        }
    }

    _columnRemove(dataSet, columnArray) {
        if (!dataSet || !columnArray) return;
        if (dataSet instanceof Array && dataSet.length === 0) return;
        if (!(dataSet instanceof Array || dataSet instanceof Object)) throw new Error('Invalid input data type provided');
        if (!(columnArray instanceof Array)) throw new Error('Requested conversion is not a valid function');
        let _dataSet = Object.create([])
        if (dataSet instanceof Object) {
            _dataSet.push(dataSet)
        }
        if (dataSet instanceof Array && _dataSet.length > 0) {
            _dataSet = dataSet
        }
        for (let i = 0; i < _dataSet.length; i++) { //process each row
            for (let ia = 0; ia < columnArray.length; ia++) { //loop through array of column names
                delete dataSet[i][columnArray[ia]]; //delete column from row
            }
        }
    }

    _conversion(dataSet, action) {
        // action = {columnName: func}
        if (!dataSet || !action) return;
        if (dataSet instanceof Array && dataSet.length === 0) return;
        if (!(dataSet instanceof Array || dataSet instanceof Object)) throw new Error('Invalid input data type provided');
        if (!(action instanceof Object)) throw new Error('Requested conversion is not a valid function');
        let _dataSet = Object.create([])
        if (dataSet instanceof Object) {
            _dataSet.push(dataSet)
        }
        if (dataSet instanceof Array && _dataSet.length > 0) {
            _dataSet = dataSet
        }
        let _columnList = Object.keys(action); //get list of colunms from action JSON

        for (let i = 0; i < _dataSet.length; i++) { //process each row
            for (let ia = 0; ia < _columnList.length; ia++) { //loop through array of column names        
                dataSet[i][_columnList[ia]] = action[_columnList[ia]](dataSet[_columnList[ia]]); //pull function and execute. place converted data back where it came from
            }
        }
    }
}

module.exports = Postprocessor;