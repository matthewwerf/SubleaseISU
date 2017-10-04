(function () {'use strict';

	var mongoose = require("mongoose"),
		User = mongoose.model('User');
	var sha1 = require("sha1");
	var config = require("../config.js");

	exports.createUser = function(req, res) {
		var newUser = new User(req.body);

		newUser.save(function (err, user) {
			if (err) {
				res.send(err);
			}
			res.json(user);
		});
	};

	exports.getSpecificUser = function(req, res) {
		User.findOne({username: req.params.username}, function (err, user) {
			if (err) {
				res.send(err);
			}
			res.json(user);
		});
	};

	exports.updateSpecificUser = function(req, res) {
		User.findOneAndUpdate({username: req.params.username}, req.body, {new: true}, function (err, user){
			if (err) {
				res.send(err);
			}
			res.json(user);
		});
	};

	exports.deleteSpecificUser = function(req, res){
		User.remove({
			username: req.params.username
		}, function(err, user){
			if (err) {
				res.send(err);
			}
			res.json({message: 'User successfully deleted'});
		});
	};

	exports.authAndReturnCookie = function(req, res){
		User.findOne({username: req.params.username}, 'hashedPassword', function (err, user) {

			if (err) {
				res.send(err);
			}
			if (user.hashedPassword == req.body.hashedPassword){
				res.json({
					"subleaseISUcookie": sha1(req.params.username + req.hashedPassword + config.salt)
				});
			} else {
				res.json({
					"error": "Incorrect password."
				});
			}

			//res.json(user);
		});
	};

}());