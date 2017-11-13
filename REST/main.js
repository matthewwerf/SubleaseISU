var express = require("express"),
	app = express(),
	port = 8080,
	mongoose = require("mongoose"),
	User = require('./models/userModel'),
	Property = require('./models/propertyModel'),
	Message = require('./models/messageModel'),
	bodyParser = require("body-parser");

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


app.use(function(req, res, next) {
	//console.log(req);
	winston.info('%s Request: To: %s, From: %s, Cookie: %s', req.method, req.url, req.body.username, req.body.subleaseISUcookie);
	next();
});

//var routes = require('./routes/userRoutes')(app); // depreciated method
var messageRoutes = require('./routes/messageRoutes'); // importing routes to messaging sockets
messageRoutes(app);
var userRoutes = require('./routes/userRoutes'); // importing user management routes
userRoutes(app);
var propertyRoutes = require('./routes/propertyRoutes'); // importing properties routes
propertyRoutes(app);

app.listen(port); // bind routes to port

console.log("REST api started on: " + port);

