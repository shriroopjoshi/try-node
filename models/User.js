// models/User.js
// Model for user schema
// To understand better, read: https://thinkster.io/tutorials/node-json-api/creating-the-user-model
var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator'); // for sending validation messages
var crypto = require('crypto'); // for hashes and salts
var jwt = require('jsonwebtoken');
var secret = require('../config').secret;

var UserSchema = new mongoose.Schema({
    username: {
        type: String,
        lowercase: true,
        unique: true,
        required: [true, "cannot be blank"],
        match:[/^[a-zA-Z0-9]+$/, 'invalid'],
        index: true
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: [true, "cannot be blank"],
        match:[/^\S+@\S+\.\S+/, 'invalid'],
        index: true
    },
    bio: String,
    hash: String,
    salt: String
}, {timestamps: true});

// validation messages
UserSchema.plugin(uniqueValidator, {message: 'is already taken'});

// set salts and hashes
UserSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

// verify hash
UserSchema.methods.validPassword = function(password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.hash === hash;
};

// method to return JWT
UserSchema.methods.generateJWT = function() {
    var today = new Date();
    var expiry = new Date(today);
    expiry.setDate(today.getDate() + 60);
    return jwt.sign({
        id: this._id,
        username: this.username,
        expiry: parseInt(expiry.getTime() / 1000)
    }, secret);
};

// method to return JSON
UserSchema.methods.toAuthJSON = function() {
    return {
        username: this.username,
        email: this.email,
        token: this.generateJWT(),
        bio: this.bio
    };
};

mongoose.model('User', UserSchema);