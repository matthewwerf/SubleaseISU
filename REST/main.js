var express = require("express"),
	app = express(),
	port = 8080,
	mongoose = require("mongoose"),
	User = require('./models/userModel'),
	Property = require('./models/propertyModel'),
	Message = require('./models/messageModel'),
	bodyParser = require("body-parser");

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://127.0.0.1:27017/SubleaseISU')
	.then(() => console.log('database connected'))
	.catch((err) => console.error(err)); 

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(function(req, res, next) { // allow CORS
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});


app.use(function(req, res, next) {
	//console.log(req);
	console.log("=============REQ===============");
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

