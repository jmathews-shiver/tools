'use strict';
const jsonwebtoken = require('jsonwebtoken');

class JWTToken {
  constructor(secretOrPrivateKey, secretOrPublicKey, options) {
    this.secretOrPrivateKey = secretOrPrivateKey;
    this.secretOrPublicKey = secretOrPublicKey;
    this.options = options;
    return this;
  };

  /**
   * @description Create a token with payload
   * @param {*} payload 
   * @param {*} signOptions 
   * @returns signed JWT
   */
  async signAsync(payload, signOptions) {
    let jwtSignOptions = Object.assign({}, signOptions, this.options);
    return await jsonwebtoken.sign(payload, this.secretOrPrivateKey, jwtSignOptions);
  };

  sign(payload, signOptions) {
    let jwtSignOptions = Object.assign({}, signOptions, this.options);
    return jsonwebtoken.sign(payload, this.secretOrPrivateKey, jwtSignOptions);
  };

  /**
   * @description Return payload without validation
   * @param {*} token 
   * @param {*} decodeOptions 
   * @returns unverified payload
   */
  decode(token, decodeOptions) {
    return jsonwebtoken.decode(token, decodeOptions);
  };

  /**
   * @description Return token payload if token is valid
   * @param {*} token 
   * @param {*} verifyOptions 
   * @returns Verified payload
   */
  async verifyAsync(token, verifyOptions) {
    let jwtVerifyOptions = Object.assign({}, verifyOptions, options);
    let key = this.secretOrPublicKey || this.secretOrPrivateKey;
    return await v.verify(token, key, jwtVerifyOptions);
  };

  verify(token, verifyOptions) {
    let jwtVerifyOptions = Object.assign({}, verifyOptions, this.options);
    let key = this.secretOrPublicKey || this.secretOrPrivateKey;
    console.log(key)
    return jsonwebtoken.verify(token, key, jwtVerifyOptions);
  };
};

module.exports = JWTToken;
