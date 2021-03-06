(function () {'use strict';

	var mongoose = require("mongoose"),
		Message = mongoose.model("Message"),
		User = mongoose.model("User"),
		sha1 = require("sha1"),
		config = require("../config.js");

	/*
	// socket declarations
	var express = require("express"),
		app = express(),
		server = require('http').createServer(app),
		io = require('socket.io')(server);
	*/

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


	/**
	 * @apiDefine UsernameNotFoundError
	 *
	 * @apiError UsernameNotFound The username of the User was not found.
	 *
	 * @apiErrorExample UsernameNotFoundError-Error-Response:
	 *     HTTP/1.1 401 Unauthorized
	 *     {
	 *       "error": "username not recognized"
	 *     }
	 */

	 /**
	 * @apiDefine UsernameNotProvided
	 *
	 * @apiError UsernameNotProvided The username of the User was not in the request.
	 *
	 * @apiErrorExample UsernameNotProvided-Error-Response:
	 *     HTTP/1.1 400 Bad request
	 *     {
	 *       "error": "username not provided in request"
	 *     }
	 */

	 /**
	 * @apiDefine DatabaseError
	 *
	 * @apiError DatabaseError There was an error in the MongoDB query
	 *
	 * @apiErrorExample DatabaseError-Error-Response:
	 *     HTTP/1.1 500 Internal Server Error
	 *     {
	 *       "error": error
	 *     }
	 */


	/* //depricated
	exports.maintainSocket = function(socket) {
		// establish socket connection
		console.log("Connection Event");
		
		socket.on('disconnect', function() {
			console.log("Disconnect Event");
		});

		socket.on('test', function(data) {
			console.log(data);
		});

		socket.on('new-message-to-server', function(data) {
			// call save history
			//saveHistory(data);
			console.log("Incoming Message: " + data);
			io.emit("server-distribute-message", data);
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
	*/

	exports.saveMessage = function(data, cb) {
		var obj = JSON.parse(data);
		if (obj.senderUsername && obj.receiverUsername && obj.message){

			var newMessage = new Message(obj);
			newMessage.timeSent = getDateTime();
			newMessage.jsTime = Date.now();

			newMessage.save(function (err, message) {
				if (err) {
					console.log(err); // how do I want to handle this error
					cb("There was an error", null);
				}
				else {
					console.log("Message Saved Successfully From: " + newMessage.senderUsername + " TO: " + newMessage.receiverUsername);
					cb(null, message);
				}
			});

		} else {
			console.log("Parameters missing");
		}
	};

	/**
	 * @api {post} /messages/saveHistory
	 * @apiName saveHistory
	 * @apiGroup Message
	 *
	 * @apiParam {string} username Users unique ID (of the user making the request).
	 * @apiParam {string} subleaseISUcookie Users unique session cookie.
	 * @apiParam {string} senderUsername Unique username of the person who sent the message.
	 * @apiParam {string} receiverUsername Unique username of the person who is receiving the message.
	 * @apiParam {string} message The message that is to be sent.
	 *
	 * @apiSuccess {string} msg Message saying that the message is saved in the history.
	 *
	 * @apiUse UsernameNotFoundError
	 * @apiUse UsernameNotProvided
	 * @apiUse DatabaseError
	 *
	 * @apiSuccessExample Success-Response:
	 *     HTTP/1.1 200 OK
	 *		{
	 *			"msg": "Messaged saved"
	 *		}
	 */
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

	/**
	 * @api {post} /messages/getHistory/{usernameOfSender}
	 * @apiName getHistory
	 * @apiGroup Message
	 *
	 * @apiParam {string} username Users unique ID (of the user making the request).
	 * @apiParam {string} subleaseISUcookie Users unique cookie.
	 * @apiParam {string} usernameOfSender Unique ID associated the user (that the requesting user would like their history with).
	 *
	 * @apiSuccess {Message[]} res Message history with the user is echoed in the response.
	 *
	 * @apiUse UsernameNotFoundError
	 * @apiUse UsernameNotProvided
	 * @apiUse DatabaseError
	 *
	 * @apiSuccessExample Success-Response:
	 *     HTTP/1.1 200 OK
	 *		[
	 *		  {
	 *		    "_id": "5a206e7e18f49761ae2db0d1",
	 *		    "jsTime": "2017-11-30T20:47:58.425Z",
	 *		    "timeSent": "2017:11:30:14:47:58",
	 *		    "message": "asdf",
	 *		    "senderUsername": "username",
	 *		    "receiverUsername": "matthewv",
	 *		    "__v": 0
	 *		  },
	 *		  {
	 *		    "_id": "5a206ea318f49761ae2db0d2",
	 *		    "jsTime": "2017-11-30T20:48:35.796Z",
	 *		    "timeSent": "2017:11:30:14:48:35",
	 *		    "senderUsername": "username",
	 *		    "receiverUsername": "matthewv",
	 *		    "message": "initial message",
	 *		    "__v": 0
	 *		  },
	 *		  {
	 *		    "_id": "5a206ef391391761c2e17dd8",
	 *		    "jsTime": "2017-11-30T20:49:55.520Z",
	 *		    "timeSent": "2017:11:30:14:49:55",
	 *		    "message": "asdasdasdasd",
	 *		    "senderUsername": "matthewv",
	 *		    "receiverUsername": "username",
	 *		    "__v": 0
	 *		  }
	 *		]
	 *
	 */
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
						try {
							var firstArrayDate = messageArray[firstArrayIndex].jsTime.valueOf();
						}
						catch (error) {
							var firstArrayDate = null;
						}
						 messages
						var secondArrayIndex = 0;
						try {
							var secondArrayDate = messages[secondArrayIndex].jsTime.valueOf();
						}
						catch (error) {
							var secondArrayDate = null;
						}
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

	/**
	 * @api {post} /messages/getUsernamesOfSenders
	 * @apiName getUsernamesOfSenders
	 * @apiGroup Message
	 *
	 * @apiParam {string} username Users unique ID (of the user making the request).
	 * @apiParam {string} subleaseISUcookie Users unique cookie.
	 *
	 * @apiSuccess {string[]} res Array of usernames that the current user has chatted with.
	 *
	 * @apiUse UsernameNotFoundError
	 * @apiUse UsernameNotProvided
	 * @apiUse DatabaseError
	 *
	 * @apiSuccessExample Success-Response:
	 *     HTTP/1.1 200 OK
	 *
	 * [
	 *     "BobJohnson12",
	 *     "Matt",
	 *     "JoeJergerSucks",
	 *     "Timmy2"
	 * ]
	 *
	 */
	exports.getUsernamesOfSenders = function(req, res) {
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
							res.status(500).send(err);
							return;
						}
						var usernameArray = [];
						for(var j=0; j<usernames.length; j++){
							let name = usernames[j].senderUsername;
							if(usernameArray.indexOf(name) == -1) {
								usernameArray.push(usernames[j].senderUsername);
							}
						}

						Message.find({
							senderUsername: req.body.username
						}, 'receiverUsername', function(err, usernamesOfRecipients) {
							if(err) {
								res.status(500).send(err);
								return;
							}
							if(usernameArray == null){
								usernameArray = [];
							}

							for(j=0; j<usernamesOfRecipients.length; j++){
								let name = usernamesOfRecipients[j].receiverUsername;
								if(usernameArray.indexOf(name) == -1) {
									usernameArray.push(usernamesOfRecipients[j].receiverUsername);
								}
							}

							res.status(200).json(usernameArray);
						});
					});
				}
			});
		}
	};

}());
