// REST Server
var express = require("express"),
	app = express(),
	port = 8080,
	// Database
	mongoose = require("mongoose"),
	User = require('./models/userModel'),
	Property = require('./models/propertyModel'),
	Message = require('./models/messageModel'),
	// Request Parser
	bodyParser = require("body-parser");

// Sockets
var http = require('http').Server(app),
	io = require('socket.io')(http);

var config = require('config');

var formidable = require('express-formidable');

var winston = require('winston'),
	logger = (winston.Logger)({
		transports: [
			new (winston.transports.Console)(),
			new (winston.transports.File)({filename: 'logs/mainLog'})
		]
	});

mongoose.Promise = global.Promise;
mongoose.connect(config.DBHost)
	.then(() => console.log('database connected'))
	.catch((err) => console.error(err)); 

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
//app.use(formidable());

app.use(function(req, res, next) { // allow CORS
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

if (process.env.NODE_ENV != 'test') {
	app.use(function(req, res, next) {
		//console.log(req);
		winston.info('%s Request: To: %s, From: %s, Cookie: %s', req.method, req.url, req.body.username, req.body.subleaseISUcookie);
		next();
	});
}

//var routes = require('./routes/userRoutes')(app); // depreciated method
var messageRoutes = require('./routes/messageRoutes'); // importing routes to messaging sockets
messageRoutes(app);
var userRoutes = require('./routes/userRoutes'); // importing user management routes
userRoutes(app);
var propertyRoutes = require('./routes/propertyRoutes'); // importing properties routes
propertyRoutes(app);

// Socket Handler
var message = require("./controllers/messageController");
io.on('connection', function(socket) {
	console.log("Connection Event");
		
	socket.on('disconnect', function() {
		console.log("Disconnect Event");
	});

	socket.on('new-message-to-server', function(data) {
		// call save history
		message.saveMessage(data, function(err, jsonObj) {
			if(err == null) {
				io.emit("server-distribute-message", jsonObj);
			}
		});
	});
});

//app.listen(port); // bind REST routes to port
//console.log("REST api started on: " + port);

http.listen(port, function(){
	console.log("Server started on: " + port);
});

module.exports = app;

