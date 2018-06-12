<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### Table of Contents

-   [JSONDo][1]
-   [getValue][2]
-   [buildBranch][3]
-   [mergeDeep][4]
-   [crawlForward][5]
-   [crawlReverse][6]

## JSONDo

Prodives a JSON configuration module that allows simply creation and lookup functionality
through dot notation

**Meta**

-   **version**: 2.0.0
-   **author**: Justin Mathews

## getValue

parses source object and retrieves value if exists

**Parameters**

-   `sourceJSON` **[JSON][7]** JSON object containing value
-   `keyMap` **[string][8]** Dot '.' delimited string mapping location of value in the source object

Returns **any** 

**Meta**

-   **author**: Justin Mathews

## buildBranch

Creates JSON and assigns value

**Parameters**

-   `keyMap` **[String][8]** Dot '.' delimited string that maps the JSON hierarchy to by created
-   `value` **any** Object assigned to the final JSON element

**Examples**

```javascript
buildBranch('this.is.a.nested.value', 'example') => {this:{is:{a:{nested:{value: 'example'}}}}}
```

Returns **[JSON][7]** Single JSON branch

**Meta**

-   **author**: Justin Mathews

## mergeDeep

Merges multilevel JSON object to return a combined result.

**Parameters**

-   `parentJSON` **[JSON][7]** 
-   `newJSON` **[JSON][7]** 

**Examples**

```javascript
A simple merge tha will add an element to a nested JSON object and overwrite another where already exists
let source = {a:1, b:{c: 'not bob', d:{age: 42}}}
let newJson = {b:{c:'is bob', d:{sex:'male'}}}
mergeDeep(source, newJson) => {a:1, b:{c:'is bob', d:{age:42, sex:'male'}}}
```

Returns **[JSON][7]** Merged Objects

**Meta**

-   **author**: Justin Mathews

## crawlForward

Process crawls the JSON starting from the beginning moving to the end. The callback is executed at each layer

**Parameters**

-   `config` **[JSON][7]** Object meeting TYPE configType structure
-   `cb` **[Function][9]** Anon function that will be executed for each layer of the JSON processed. Requires a single parameter to allow the current JSON layer to be passed. A "return" is niether required nor desired
-   `subLevelName` **[String][8]** Name of element that leads to the next layer.
-   `level` **[Number][10]** (undefined) Value sets the starting position of the hierarchy. 
    This is primarily used by the process to pass the previous layer depth.  Adds elemeent "level"
    If undefined, the hierarchy is not mapped

Returns **[JSON][7]** 

## crawlReverse

Process crawls the JSON starting from the end of each branch moving to the beginning. The callback is executed at each layer

**Parameters**

-   `json` **[JSON][7]** Object meeting TYPE configType structure
-   `cb` **[Function][9]** Anon function that will be executed for each layer of the JSON processed. Requires a single parameter to allow the current JSON layer to be passed. A "return" is niether required nor desired
-   `subLevelName` **[String][8]** Name of element that leads to the next layer.

Returns **[JSON][7]** JSON object with the desired changes

[1]: #jsondo

[2]: #getvalue

[3]: #buildbranch

[4]: #mergedeep

[5]: #crawlforward

[6]: #crawlreverse

[7]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/JSON

[8]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String

[9]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function

[10]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number