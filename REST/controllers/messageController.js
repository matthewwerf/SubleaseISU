(function () {'use strict';

	var mongoose = require("mongoose"),
		Message = mongoose.model("Message"),
		User = mongoose.model("User"),
		sha1 = require("sha1"),
		config = require("../config.js");

	// socket declarations
	var express = require("express"),
		app = express(),
		server = require('http').createServer(app),
		io = require('socket.io')(server);

	// depreciated, never tested
	/*
	exports.createMessage = function (req, res) {
		if(!req.body.subleaseISUcookie || !req.body.username) {
			res.status(401).send({
				"error" : "not authenticated"
			});
			return;
		} else {
			User.findOne({username: req.body.username}, 'hashedPassword', function (err, user) {
				var localCookieToCheck = sha1(req.body.username + user.hashedPassword + config.salt);
				if(localCookieToCheck != req.body.subleaseISUcokkie) {
					res.status(401).send({
						"error" : "authentication rejected" // check which message I look for in the front end
					});
					return;
				}
			});
		}

	};
	*/

	exports.maintainSocket = function(req, res) {
		if(!req.body.subleaseISUcookie || !req.body.username) {
			res.status(401).send({
				"error" : "not authenticated"
			});
			return;
		} else {
			User.findOne({username: req.body.username}, 'hashedPassword', function (err, user) {
				var localCookieToCheck = sha1(req.body.username + user.hashedPassword + config.salt);
				if(localCookieToCheck != req.body.subleaseISUcookie) {
					res.status(401).send({
						"error" : "authentication rejected" // check which message I look for in the front end
					});
					return;
				}
				else {
					// establish socket connection
					io.on('connection', function(socket) {
						console.log("Connection Event");
						socket.on('disconnect', function() {
							console.log("Disconnect Event");
						});
						socket.on("new-message-to-server", function(data) {
							// call save history
							saveHistory(data);
							console.log("Incoming Message: " + data);

							io.emit("server-distribute-message", {
								message: data
							});
						});
					});
					// on

				}
			});
		}
	};

	function saveHistory(data) {
		if (data.senderUsername && data.receiverUsername && data.message){

			var newMessage = new Message(req.body);

			newMessage.save(function (err, message) {
				if (err) {
					console.log(err); // how do I want to handle this error
				}
			});
		} else {
			console.log("Error in saveHistory");
		}
	}

	exports.getHistory = function(req, res) {
		if(!req.body.subleaseISUcookie || !req.body.username) {
			res.status(401).send({
				"error" : "not authenticated"
			});
			return;
		} else {
			User.findOne({username: req.body.username}, 'hashedPassword', function (err, user) {
				if(user == null) { // don't forget to check this is all functions
					res.status(401).send({
						"error": "username not recognized"
					});
					return;
				}

				var localCookieToCheck = sha1(req.body.username + user.hashedPassword + config.salt);
				if(localCookieToCheck != req.body.subleaseISUcookie) {
					res.status(401).send({
						"error" : "authentication rejected" // check which message I look for in the front end
					});
					return;
				}
				else {
					Message.find({
						receiverUsername: req.body.username,
						senderUsername: req.params.usernameOfSender
					}, function(err, messages) {
						if(err) {
							res.send(err);
							return;
						}
						res.json(messages);
					});
				}
			});
		}
	};

	exports.getUsernamesOfSenders = function(req, res) {
		console.log("Message, sender usernames: POST");
		if(!req.body.subleaseISUcookie || !req.body.username) {
			res.status(401).send({
				"error" : "not authenticated"
			});
			return;
		} else {
			User.findOne({username: req.body.username}, 'hashedPassword', function (err, user) {
				if(user == null) { // don't forget to check this is all functions
					res.status(401).send({
						"error": "username not recognized"
					});
					return;
				}

				var localCookieToCheck = sha1(req.body.username + user.hashedPassword + config.salt);
				if(localCookieToCheck != req.body.subleaseISUcookie) {
					res.status(401).send({
						"error" : "authentication rejected" // check which message I look for in the front end
					});
					return;
				}
				else {
					Message.find({
						receiverUsername: req.body.username,
					}, 'senderUsername', function(err, usernames) {
						if(err) {
							res.send(err);
							return;
						}
						var usernameArray = [];
						for(var j=0; j<usernames.length; j++){
							let name = usernames[j].senderUsername;
							if(usernameArray.indexOf(name) == -1) {
								usernameArray.push(usernames[j].senderUsername);
							}
						}
						res.json(usernameArray);
					});
				}
			});
		}
	};

}());
