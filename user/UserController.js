// user/UserController.js

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());

var user = require('./User');

// post
router.post('/', function(req, res) {
    user.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    }, function(err, user) {
        if(err)
            return res.status(500).send("Error: " + err);
        res.status(200).send(user);
    });
});

// get-all
router.get('/', function(req, res) {
    user.find({}, function(err, users){
        if(err)
            return res.status(500).send("Error: " + err);
        res.status(200).send(users);
    });
});

// get-one
router.get('/:id', function(req, res) {
    user.findById(req.params.id, function(err, user) {
        if(err)
            return res.status(500).send("Error: " + err);
        if(!user)
            return res.status(404).send("No such user");
        res.status(200).send(user);
    });
});


// delete
router.delete('/:id', function(req, res) {
    user.findByIdAndRemove(req.params.id, function(err, user) {
        if(err)
            return res.send("Error: " + err);
        res.status(200).send("user deleted");
    });
});

// update
router.put('/:id', function(req, res) {
    user.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    }, function(err, user) {
        if(err)
            return res.status(500).send("Error: " + err);
        res.status(200).send(user);
    });
});

module.exports = router;