'use strict';

var env = process.env.NODE_ENV || 'development';
// Load server configuration
var config = require(`${__dirname}/env/${env}`);

module.exports = config;

