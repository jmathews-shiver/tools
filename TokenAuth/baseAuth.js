'use strict'

//role
buildPayload(ID){
    return {
        clientID: ID
    };
};

//token
createToken(clientID, payload){
    let JWTToken = new JWTToken('a', 'a', {});
    return token.sign(payload);
};

///////////////////////////////////////////////////////

//parse
//validate
//role
buildPayload(ID){
    let JWTToken = new JWTToken('a', 'a', {});
    return token.decode(ID);
};

//token
createToken(clientID, payload){
    let JWTToken = new JWTToken('a', 'a', {});
    return token.sign(payload);
};



//////////////
function parent(parser, validator, payload, token) {
    this.parser = new parser();
    this.validator = new validator();
    this.payload = new payload();
    this.token = new token();
    if (!(this.parser instanceof baseParser)) throw error;

    return (req) => {
        let meta = {};
        meta = this.parser.parse(req);
        meta = this.validator.validateSession(meta);
        meta = this.payload.buildPayload();
        meta = this.token.createToken();
        req.in = meta;
    };
};