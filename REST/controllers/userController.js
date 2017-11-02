(function () {'use strict';

	var mongoose = require("mongoose"),
		User = mongoose.model('User');
	var sha1 = require("sha1");
	var config = require("../config.js");

	exports.createUser = function(req, res) {
		// Logging
		console.log("User creation request: POST");


		var newUser = new User(req.body);

		User.findOne({username: req.body.username}, function (err, user) {
			if (err) {
				res.status(500).send(err);
			} else {
				if(user == null){
					newUser.save(function (err, user) {
						if (err) {
							res.status(500).send(err);
						}
						res.status(201).json(user);
					});
				}else if(user.username != null) {
					res.status(400).json({
						"error": "Username already exists"
					});
				} else {
					newUser.save(function (err, user) {
						if (err) {
							res.status(500).send(err);
						}
						res.status(201).json(user);
					});
				}
			}
		});
	};

	exports.getSpecificUser = function(req, res) {
		User.findOne({username: req.params.username}, function (err, user) {
			if (err) {
				res.status(500).send(err);
			}
			res.status(200).json(user);
		});
	};

	exports.updateSpecificUser = function(req, res) {
		User.findOneAndUpdate({username: req.params.username}, req.body, {new: true}, function (err, user){
			if (err) {
				res.status(500).send(err);
			}
			res.status(200).json(user);
		});
	};

	exports.deleteSpecificUser = function(req, res){
		User.remove({
			username: req.params.username
		}, function(err, user){
			if (err) {
				res.status(500).send(err);
			}
			res.status(200).json({message: 'User successfully deleted'});
		});
	};

	exports.authAndReturnCookie = function(req, res){
		console.log(req);
		User.findOne({username: req.params.username}, 'hashedPassword', function (err, user) {

			if (err) {
				res.status(500).send(err);
			}
			if (user.hashedPassword == req.body.hashedPassword){
				res.status(200).json({
					"subleaseISUcookie": sha1(req.params.username + req.body.hashedPassword + config.salt)
				});
			} else {
				res.status(400).json({
					"error": "Incorrect password."
				});
			}
		});
	};

	exports.allowRouting = function(req, res) {
		if (!req.body.subleaseISUcookie || !req.body.username){
			res.status(401).send({
				"error": "not authenticated"
			});
			return;
		} else {
			User.findOne({username: req.body.username}, 'hashedPassword', function(err, user){
				var localCookieToCheck = sha1(req.body.username + user.hashedPassword + config.salt);
				if(localCookieToCheck != req.body.subleaseISUcookie) {
					res.status(401).send({
						"error": "authentication rejected"
					});
				} else {
					res.status(200).send({
						"msg": "authentication accepted"
					});
				}
			});
		}
	};

}());
