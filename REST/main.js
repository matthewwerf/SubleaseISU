var express = require("express"),
	app = express(),
	port = process.env.PORT || 8080,
	mongoose = require("mongoose"),
	User = require('./models/userModel'),
	bodyParser = require("body-parser");

mongoose.Promise = global.Promise;
/* SubleaseISU is name of Mongo Docker Container and its respective Database */
mongoose.connect('mongodb://admin:testPass1234@SubleaseISU/SubleaseISU');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var routes = require('./routes/userRoutes')(app);

app.listen(port);

console.log("REST api started on: " + port);

