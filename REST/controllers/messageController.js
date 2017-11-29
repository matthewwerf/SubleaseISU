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

	var ah = require('../lib/authHelper.js');

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

	exports.maintainSocket = function(socket) {
		// establish socket connection
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
	};

	function saveHistory(data) {
		if (data.senderUsername && data.receiverUsername && data.message){

			var newMessage = new Message(req.body);
			newMessage.timeSent = getDateTime();

			newMessage.save(function (err, message) {
				if (err) {
					console.log(err); // how do I want to handle this error
				}
			});

		} else {
			console.log("Error in saveHistory");
		}
	}

	exports.saveHistory = function(req, res) {
		ah.validateAuth(req, res, function(user) {
			if (user != null) {
				var newMessage = Message(req.body);
				newMessage.timeSent = getDateTime();
				newMessage.jsTime = Date.now();

				newMessage.save(function (err, message) {
					if(err) {
						res.status(500).send(err);
						return;
					}
					res.status(201).json({
						"msg" : "Messaged saved"
					});
				});
			}
		});
	};

	function getDateTime() {

	    var date = new Date();

	    var hour = date.getHours();
	    hour = (hour < 10 ? "0" : "") + hour;

	    var min  = date.getMinutes();
	    min = (min < 10 ? "0" : "") + min;

	    var sec  = date.getSeconds();
	    sec = (sec < 10 ? "0" : "") + sec;

	    var year = date.getFullYear();

	    var month = date.getMonth() + 1;
	    month = (month < 10 ? "0" : "") + month;

	    var day  = date.getDate();
	    day = (day < 10 ? "0" : "") + day;

	    return year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;

	}

	exports.getHistory = function(req, res) {
		ah.validateAuth(req, res, function(user) {
			if(user != null) {
				//var messageArray = [];

				Message.find({
					receiverUsername: req.body.username,
					senderUsername: req.params.usernameOfSender
				}, function(err, messageArray) {
					if(err) {
						res.send(err);
						return;
					}
					//messageArray = messages;

					Message.find({
						receiverUsername: req.params.usernameOfSender,
						senderUsername: req.body.username
					}, function(err, messages) {
						if(err) {
							res.send(err);
							return;
						}

						// messageArray
						var firstArrayIndex = 0;
						var firstArrayDate = messageArray[firstArrayIndex].jsTime.valueOf();
						
						// messages
						var secondArrayIndex = 0;
						var secondArrayDate = messages[secondArrayIndex].jsTime.valueOf();
						
						// result
						var mergedMessageArray = [];

						// try to merge both
						while(firstArrayDate != null && secondArrayDate != null) {
							if(firstArrayDate > secondArrayDate) {
								mergedMessageArray.push(messages[secondArrayIndex]);
								secondArrayIndex++;
								try {
									secondArrayDate = messages[secondArrayIndex].jsTime.valueOf();
								}
								catch (error) {
									secondArrayDate = null;
								}
							} else{
								mergedMessageArray.push(messageArray[firstArrayIndex]);
								firstArrayIndex++;
								try {
									firstArrayDate = messageArray[firstArrayIndex].jsTime.valueOf();
								}
								catch (error) {
									firstArrayDate = null;
								}
							}
						}

						// first array emptied
						while(secondArrayDate != null) {
							mergedMessageArray.push(messages[secondArrayIndex]);
							secondArrayIndex++;
							try {
								secondArrayDate = messages[secondArrayIndex].jsTime.getTime();
							}
							catch (error) {
								secondArrayDate = null;
							}
						}

						// second array emptied
						while(firstArrayDate != null) {
							mergedMessageArray.push(messageArray[firstArrayIndex]);
							firstArrayIndex++;
							try {
								firstArrayDate = messageArray[firstArrayIndex].jsTime.getTime();
							}
							catch (error) {
								firstArrayDate = null;
							}
						}

						res.status(200).json(mergedMessageArray);
					});
				});

			}
		});
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
