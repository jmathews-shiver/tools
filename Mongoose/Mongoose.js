'use strict';

class Mongoose extends require('mongoose').Mongoose {
    constructor(connectionMeta) {
        super();
        this.name = connectionMeta.Name;
        this.URI = connectionMeta.URI;
        this.Options = connectionMeta.Options;
        // this.connection.on('connected', () => { console.log('Connected to Mongo DB ' + this.name + ' at ' + this.URI); });
        // this.connection.on('error', (err) => console.log('Mongoose error detected: ' + err));
        // this.connection.on('disconnected', () => console.log('Disconnected connection to Mongo DB ' + this.name));

        this.db = this.connect(this.URI, this.Options);
    };

    closeConnections() {
        this.disconnect();
    };
};

module.exports = Mongoose;


const Mongoose = require('./Mongoose.js');
const config = {
    Name: 'db connection name',
    URI: 'db connection path mongodb://',
    Options: {}
};
const DB1 = new Mongoose(config);