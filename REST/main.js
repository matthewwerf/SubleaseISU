var express = require("express"),
	app = express(),
	port = 8080,
	mongoose = require("mongoose"),
	User = require('./models/userModel'),
	Property = require('./models/propertyModel'),
	bodyParser = require("body-parser");

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://127.0.0.1:27017/SubleaseISU');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

app.use(function(req, res, next) {
	console.log(req);
	console.log("===============================");
	next();
});

//var routes = require('./routes/userRoutes')(app);
var userRoutes = require('./routes/userRoutes'); //importing route
userRoutes(app);
var propertyRoutes = require('./routes/propertyRoutes');
propertyRoutes(app);

app.listen(port);

console.log("REST api started on: " + port);

