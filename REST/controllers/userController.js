(function () {'use strict';

	var mongoose = require("mongoose"),
		User = mongoose.model('User');
	var sha1 = require("sha1");
	var config = require("../config.js");

	// multipart/formdata
	var formidable = require('formidable');

	// Photo Upload
	var multer = require('multer'),
		Storage = multer.diskStorage({
			destination: function(req, file, callback) {
				callback(null, './Images');
			},
			filename: function(req, file, callback) {
				callback(null, file.fieldname + '-' + req.body.username  + '-' + Date.now());
			}
		}),
		upload = multer({
			storage: Storage
		});

	// File Helper
	var fh = require('../lib/fileHelper.js');
	// Auth Helper
	var ah = require('../lib/authHelper.js');


	/**
	 * @api {post} /users
	 * @apiName createUser
	 * @apiGroup User
	 *
	 * @apiParam {string} username Users unique ID.
	 * @apiParam {string} userType User's Account type. (Admin, Leaser, Renter)
	 * @apiParam {string} hashedPassword SHA1 Hash of User's Password.
	 * @apiParam {string} email User's email address. (Optional)
	 * @apiParam {string} phoneNumber User's phone number.
	 *
	 * @apiSuccess {User} res The Object is echoed back in the response
	 */
	exports.createUser = function(req, res) {
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
				} 
				// This should not be necessary
				/*
				else {
					newUser.save(function (err, user) {
						if (err) {
							res.status(500).send(err);
						}
						res.status(201).json(user);
					});
				}
				*/
			}
		});
	};

	/**
	 * @api {get} /users/{userName}
	 * @apiName getSpecificUser
	 * @apiGroup User
	 *
	 * @apiParam {string} userName Users unique ID.
	 *
	 * @apiSuccess {User} res The User Object is returned in the response.
	 */
	exports.getSpecificUser = function(req, res) {
		User.findOne({username: req.params.username}, function (err, user) {
			if(user == null) { // don't forget to check this is all functions
				res.status(404).send({
					"error": "username not recognized"
				});
				return;
			}
				
			if (err) {
				res.status(500).send(err);
			}
			res.status(200).json(user);
		});
	};

	/**
	 * @api {put} /users/{userName}
	 * @apiName updateSpecificUser
	 * @apiGroup User
	 *
	 * @apiParam {string} userName Users unique ID.
	 * @apiParam {string} subleaseISUcookie Users unique cookie.
	 * @apiParam {string} email Users email.
	 * @apiParam {string} password Users password.
	 * @apiParam {string} email Users phone.
	 *
	 * @apiSuccess {User} res The User Object is returned in the response
	 */
	exports.updateSpecificUser = function(req, res) {
		ah.validateAuth(req, res, function(user){
			if(user != null) {
				User.findOneAndUpdate({username: req.params.username}, req.body, {new: true}, function (err, user){
					if(user == null) { // don't forget to check this is all functions
						res.status(401).send({
							"error": "username not recognized"
						});
						return;
					}

					if (err) {
						res.status(500).send(err);
					}
					res.status(200).json(user);
				});
			}
		});
	};

	/**
	 * @api {delete} /users/{userName}
	 * @apiName deleteSpecificUser
	 * @apiGroup User
	 *
	 * @apiParam {string} userName Users unique ID.
	 * @apiParam {string} subleaseISUcookie Users unique cookie.
	 *
	 * @apiSuccess {User} res The success message is returned
	 */
	exports.deleteSpecificUser = function(req, res){
		ah.validateAuth(req, res, function(user){
			if(user != null) {
				User.remove({
					username: req.params.username
				}, function(err, user){
					if (err) {
						res.status(500).send(err);
					}
					res.status(200).json({msg: 'User successfully deleted'});
				});
			}
		});
	};

	/**
	 * @api {post} /login/{username}
	 * @apiName authAndReturnCookie
	 * @apiGroup User
	 *
	 * @apiParam {string} username Users unique ID.
	 * @apiParam {string} hashedPassword Users hased password.
	 *
	 * @apiSuccess {User} res Users username and cookie is echoed back in the response.
	 */
	exports.authAndReturnCookie = function(req, res){
		User.findOne({username: req.params.username}, 'hashedPassword', function (err, user) {
			if(user == null) { // don't forget to check this is all functions
				res.status(401).send({
					"error": "username not recognized"
				});
				return;
			}

			if (err) {
				res.status(500).send(err);
			}
			if (user.hashedPassword == req.body.hashedPassword){
				res.status(200).json({
					"subleaseISUcookie": sha1(req.params.username + req.body.hashedPassword + config.salt)
				});
			} else {
				res.status(400).json({
					"error": "Incorrect cookie"
				});
			}
		});

	};

	/**
	 * @api {post} /users/{userName}
	 * @apiName allowRouting
	 * @apiGroup User
	 *
	 * @apiParam {string} userName Users unique ID.
	 * @apiParam {string} subleaseISUcookie Users unique cookie.
	 *
	 * @apiSuccess {User} res The success message "authentication accepted" is returned
	 */
	exports.allowRouting = function(req, res) {
		ah.validateAuth(req, res, function(user){
			if(user != null) {
				res.status(200).send({
					"msg" : "authentication accepted"
				});
			}
		});
	};

	/**
	 * @api {post} /uploadProfilePicture/{userName}
	 * @apiName uploadProfilePicture
	 * @apiGroup User
	 *
	 * @apiParam {string} userName Users unique ID.
	 * @apiParam {string} subleaseISUcookie Users unique cookie.
	 *
	 * @apiSuccess {User} res The User Object is echoed back in the response
	 */
	exports.uploadProfilePicture = function(req, res) {
		var form = formidable.IncomingForm();
		var fileLocation = null;

		form.parse(req, function(err, fields, files) {
			
			if (!fields.subleaseISUcookie || !fields.username) {
				res.status(401).send({
					"error": "not authenticated"
				});
				fh.deleteFile(fileLocation);
				console.log('Unauthorized, File Deteled: ' + fileLocation);
				return;
			} else {
				User.findOne({username: fields.username}, 'hashedPassword', function(err, user){

					if(user == null) { // don't forget to check this is all functions
						res.status(401).send({
							"error": "username not recognized"
						});
						fh.deleteFile(fileLocation);
						console.log('Unauthorized, File Deteled: ' + fileLocation);
						return;
					}
		
					var localCookieToCheck = sha1(fields.username + user.hashedPassword + config.salt);
					if(localCookieToCheck != fields.subleaseISUcookie) {
						res.status(401).send({
							"error": "authentication rejected"
						});
						fh.deleteFile(fileLocation);
						console.log('Unauthorized, File Deteled: ' + fileLocation);
						return;
					} else {
						// if authentication is accepted add listeners to save file
						console.log("Authentication Accepted");

						User.findOneAndUpdate({username: fields.username}, {profilePictureLocation: fileLocation}, {new: true}, function(err, user) {
							if(user == null) { // don't forget to check this is all functions
								res.status(401).send({
									"error": "username not recognized"
								});
								return;
							}

							if (err) {
								res.status(500).send(err);
							}
						res.status(200).json(user);
						});
					}
				});
			}
		});

		form.addListener('fileBegin', function(name, file) {
			console.log("FileBegin Detected");
			file.path = __dirname + '/profilePictures/' + file.name + Date.now();
			fileLocation = file.path;
			console.log("File Path Created");
		});

		form.addListener('file', function(name, file) {
			console.log("File Detected");
		});

		form.addListener('end', function() {
			console.log('Saved at: ' + fileLocation);
		});

	};

	/**
	 * @api {post} /retrieveProfilePicture/{userName}
	 * @apiName retrieveProfilePic
	 * @apiGroup User
	 *
	 * @apiParam {string} userName Users unique ID.
	 * @apiParam {string} subleaseISUcookie Users unique cookie.
	 *
	 * @apiSuccess {User} res The profilePictureLocation property of the User object is returned
	 */
	exports.retrieveProfilePic = function(req, res) {
		ah.validateAuth(req, res, function(user) {
			if(user != null) {
				if(user.profilePictureLocation != null) {
					//let path = user.profilePictureLocation.replace(/(\s+)/g, '\\$1');
					res.status(200).sendFile(user.profilePictureLocation);
				} else {
					res.status(404).send({
						"error": "Profile Picture Location Does Not Exist"
					});
				}
			}
		});
	};

	exports.getPendingApprovals = function(req, res) {
		var queryUsername;
		if(req.body.username != null) {
			User.findOne({username: req.body.username}, function (err, user) {
				if(user == null) { // don't forget to check this is all functions
					res.status(401).send({
						"error": "username not recognized"
					});
					return;
				}

				if (err) {
					res.status(500).send(err);
					return;
				}
				var localCookieToCheck = sha1(req.body.username + user.hashedPassword + config.salt);
				if (localCookieToCheck == req.body.subleaseISUcookie){
					if(user.userType == null) {
						res.status(500).json({
							"msg" : "userType is not set for this accout"
						});
						return;
					} else if(user.userTypeApproved == 'regular') {
						res.status(401).json({
							"error": "you are not authorized for this page"
						});
						return;
					} else if(user.userTypeApproved == null){
						res.status(401).json({
							"error": "your account is pending approval"
						});
						return;
					} else if(user.userTypeApproved == false){
						res.status(401).json({
							"error": "your account is not approved"
						});
						return;
					} else if(user.userTypeApproved == true){
						User.find({$or:[{userType: 'leasing'}, {userType: 'admin'}]}, function(err, users) {
							res.status(200).json(users);
						});

					}
				} else {
					res.status(400).json({
						"error": "Incorrect cookie"
					});
					return;
				}
			});
		} else {
			res.status(400).json({
				"error" : "username not provided in request"
			});
			return;
		}
		
	};

	exports.approveUserType = function(req, res) {
		ah.validateAuth(req, res, function(user) {
			if(user != null) {
				if(user.userTypeApproved != null){
					if(user.userType == 'admin' && user.userTypeApproved == true) {
						if(req.params.accountUsername == null || req.params.accountUsername == "undefined") {
							res.status(400).json({
								"error" : "username is undefined"
							});
							return;
						}

						User.findOneAndUpdate({username: req.params.accountUsername}, {userTypeApproved: req.body.approvalBoolean}, {new: true}, function(err, user) {
							if(err) {
								res.status(500).send(err);
								return;
							}
							res.status(200).json({
								"msg" : "user updated"
							});
						});
					} else {
						res.status(401).json({
							"error" : "you are not an approved admin"
						});
					}
				} else {
					res.status(401).json({
						"error" : "your account is still pending approval"
					});
				}
			}
		});
	};

}());
