// app.js
// This file will be used to configure the app, and that alone.
// All the logic will be put in its respective directory
var express = require('express');
var app = express();
var db = require('./db');

// user controller
var UserController = require('./user/UserController');
app.use('/users', UserController);

module.exports = app;