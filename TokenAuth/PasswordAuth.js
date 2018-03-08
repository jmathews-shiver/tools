'use strict'

//validate
//role
let roles = db.findone(clientID)
return roles

//token
let JWTToken = new JWTToken('a', 'a', {});
return token.sign(payload);


function login(req, res, next) {
    let clientID = getClientID(req);
    let token = getToken(req);
    let password = getPassword(req);
    if (!token && !password) throw error;
    let type = (token) ? 'token' : 'password';
    type = token & clientid=bob & token=ssss
};






