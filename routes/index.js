// routes/index.js
// Appends api/ in url

var router = require('express').Router();

router.use('/api', require('./api'));

module.exports = router;