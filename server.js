// server.js
// starting point of execution
// loads the app and starts the server

var app = require('./app.js');
var port = process.env.PORT || 3000;

var server = app.listen(port, function() {
    console.log('Server started on port ' + port);
});