'use strict'

    //parser
    input - req
    output - username, key
    //validate
    input - username, key
    output - username
    //pull body
    input - username
    output - username, payload
    //create token
    input -
        output -

        function login(req, res, next) {
            let clientID = getClientID(req);
            let token = getToken(req);
            let password = getPassword(req);
            if (!token && !password) throw error;
            let type = (token) ? 'token' : 'password';
            type = token & clientid=bob & token=ssss

        };



