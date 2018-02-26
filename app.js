// app.js
// This file will be used to configure the app, and that alone.
// All the logic will be put in its respective directory

var fs = require('fs'),
    http = require('http'),
    path = require('path'),
    methods = require('methods'),
    express = require('express'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    cors = require('cors'),
    passport = require('passport'),
    errorhandler = require('errorhandler'),
    mongoose = require('mongoose'),
    db = require('./db.js');

var isProduction = process.env.NODE_ENV === 'production';

// create a global app
var app = express();
app.use(cors());

// normal express config defaults
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(require('method-override')());
app.use(express.static(__dirname + '/public'));

app.use(session({
    secret: 'some-secret',
    cookie: {maxAge: 6000},
    resave: false,
    saveUninitialized: false
}));

// error handlers
if(!isProduction) {
    app.use(errorhandler());
}


// database connections
if(isProduction) {
    mongoose.connect(process.env.MONGODB_URI);
} else {
    var connUri = "mongodb://" + db.user + ":" + db.password + "@" + db.conn_url;
    console.log("DB_URI: " + connUri);
    mongoose.connect(connUri);
    mongoose.set('debug', true);
}

// router
var routes = require('./routes');
// app.use(app.router);
// routes.initilize(app);
// No need for these lines now. Read the migration guide:
// https://github.com/expressjs/express/wiki/Migrating-from-3.x-to-4.x

// catch 404s and fwd to error handler
app.use(function(req, res, next) {
    var err = new Error('Not found');
    err.status = 404;
    next(err);
});

// dev error handlers - will print stacktrace
if(!isProduction) {
    app.use(function(err, req, res, next) {
        console.log(err.stack);
        res.status(err.staatus || 500);
        res.json({
            'errors' : {
                message: err.message,
                error: err
            }
        });
    });
}

// prod error handlers - no stacktrace
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({'errors': {
    message: err.message,
    error: {}
  }});
});

module.exports = app;