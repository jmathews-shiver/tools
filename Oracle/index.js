
'use strict'

const config = {
    user: 'node',
    password: 'node',
    connectString: 'node',
    poolAlias: 'node',
    poolMin: 1,
    poolMax: 2,
    poolIncrement: 1,
    _enableStats: true
};
var OraDB = require('./OraDB.js');

let db = new OraDB(config);

db.on('open', function () {
    OraDB.simpleExecutes('node', 'select * from node.test', [], {close: true})
        .then(r => { console.log(r) })
        .catch(err => { console.log(err) });
        OraDB.simpleExecutes('node', 'select * from node.test', [], {close: true})
            .then(r => { console.log(r) })
            .catch(err => { console.log(err) });
            OraDB.simpleExecutes('node', 'select * from node.test', [], {close: true})
                .then(r => { console.log(r) })
                .catch(err => { console.log(err) });
                OraDB.simpleExecutes('node', 'select * from node.test', [], {close: true})
                    .then(r => { console.log(r) })
                    .catch(err => { console.log(err) });
                    OraDB.simpleExecutes('node', 'select * from node.test', [], {close: true})
                        .then(r => { console.log(r) })
                        .catch(err => { console.log(err) });
                        OraDB.simpleExecutes('node', 'select * from node.test', [], {close: true})
                            .then(r => { console.log(r) })
                            .catch(err => { console.log(err) });
});
//var OraSQL = require('./oraSQL.js');
// async function test() {
//         return await db.simpleExecute('node', 'select * from node.test', [], {});
// };
/* 
try {
    test();
} catch (err) { };
 */
// setTimeout(() => {

//     try {
//         let a = test();
//         console.log(a)
//     } catch (err) {
//         console.log(err)
//     };
// }, 1000);
/* OraDB.openConnections()
    .then(() => { 
        return OraDB.simpleExecute('node', 'select * from node.test', [],{});
        })
        .then(result=>{console.log(result);})
    .catch((err) => { console.log(err) });
 *///var SQL = new OraSQL();

//sconsole.log(db)
//console.log(OraDB)



// var pool = db.createPool(config);
// console.log(db.getpool('node'))


//var result = OraDB.simpleExecute('node', 'select * from node.test', [],{});
//console.log(result);
