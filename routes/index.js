/*jshint esversion: 6 */ 

let landing = require('./landing');

module.exports = function (app) {
    app.use('/', landing);
}