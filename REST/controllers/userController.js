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

	/**
	 * @api {post} /users
	 * @apiName createUser
	 * @apiGroup User
	 *
	 * @apiParam {string} username Users unique ID.
	 * @apiParam {string} userType User's Account type. (Admin, Leaser, Renter)
	 * @apiParam {string} hashedPassword SHA1 Hash of User's Password.
	 * @apiParam {string} email User's email address. (Optional)
	 * @apiParam {string} phoneNumber User's phone number. (Optional)
	 * @apiParam {string[]} favoriteProperties propertyIDs of User's favorite properties. (Initially null, optional)
	 *
	 * @apiSuccess {User} res The User Object is echoed back in the response
	 *
	 * @apiUse UsernameNotFoundError
	 * @apiUse UsernameNotProvided
	 * @apiUse DatabaseError
	 *
	 * @apiSuccessExample Success-Response:
	 * HTTP/1.1 200 OK
	 * {
	 *   "_id" : ObjectId("59f8eb5fefc008260848e563"),
	 *   "username" : "matthewv",
	 *   "userType" : "admin",
	 *   "favoriteProperties" : [],
	 *   "userTypeApproved" : false,
	 *   "email" : "test@test.test",
	 *   "phoneNumber" : "1212121212",
	 *   "__v" : 0,
	 *   "profilePictureLocation" : "/home/matthewv/SD_B_1_ProjectName/REST/controllers/propertyPictures/Screen Shot 2017-12-03 at 1.05.46 PM.png1512336951925"
	 * }
 	 *		
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
	 *
	 * @apiUse UsernameNotFoundError
	 * @apiUse UsernameNotProvided
	 * @apiUse DatabaseError
	 *
	 * @apiSuccessExample Success-Response:
	 * HTTP/1.1 200 OK
	 * {
	 *   "_id" : ObjectId("59f8eb5fefc008260848e563"),
	 *   "username" : "matthewv",
	 *   "userType" : "admin",
	 *   "favoriteProperties" : [],
	 *   "userTypeApproved" : false,
	 *   "email" : "test@test.test",
	 *   "phoneNumber" : "1212121212",
	 *   "__v" : 0,
	 *   "profilePictureLocation" : "/home/matthewv/SD_B_1_ProjectName/REST/controllers/propertyPictures/Screen Shot 2017-12-03 at 1.05.46 PM.png1512336951925"
	 * }
 	 *		
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
	 * @apiParam {string} userName Users unique ID, of the account to be updated.
	 * @apiParam {string} username Users unique ID, of the account making the request.
	 * @apiParam {string} subleaseISUcookie Users unique session cookie.
	 * @apiParam {string} userType User's Account type. (Admin, Leaser, Renter) (Optional)
	 * @apiParam {string} userTypeApproved Boolean representing approval of userType. (Initially null, Optional)
	 * @apiParam {string} hashedPassword SHA1 Hash of User's Password. (Optional)
	 * @apiParam {string} email User's email address. (Optional)
	 * @apiParam {string} phoneNumber User's phone number. (Optional)
	 * @apiParam {string[]} favoriteProperties propertyIDs of User's favorite properties. (Initially null, optional)
	 *
	 * @apiSuccess {User} res The updated User Object is echoed in the response
	 *
	 * @apiUse UsernameNotFoundError
	 * @apiUse UsernameNotProvided
	 * @apiUse DatabaseError
	 *
	 * @apiSuccessExample Success-Response:
	 * HTTP/1.1 200 OK
	 * {
     *   "_id" : ObjectId("59f8eb5fefc008260848e563"),
     *   "username" : "johnSmith34",
     *   "userType" : "regular",
     *   "favoriteProperties" : [],
     *   "userTypeApproved" : null,
     *   "email" : "test@test.test",
     *   "phoneNumber" : "1212121212",
     *   "__v" : 0,
     *   "profilePictureLocation" : "/home/matthewv/SD_B_1_ProjectName/REST/controllers/propertyPictures/Screen Shot 2017-12-03 at 1.05.46 PM.png1512336951925"
	 * }
 	 *	
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
	 * @apiParam {string} userName Users unique ID, of the account to be deleted.
	 * @apiParam {string} username Users unique ID, of the account making the request.
	 * @apiParam {string} subleaseISUcookie Users unique session cookie.
	 *
	 * @apiSuccess {string} msg The success message is returned
	 *
	 * @apiUse UsernameNotFoundError
	 * @apiUse UsernameNotProvided
	 * @apiUse DatabaseError
	 *
	 * @apiSuccessExample Success-Response:
	 * HTTP/1.1 200 OK
	 * {
     *   "msg" : "User successfully deleted"
	 * }
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
	 * @apiGroup User_Authentication
	 *
	 * @apiParam {string} username Users unique ID.
	 * @apiParam {string} hashedPassword Users hased password.
	 *
	 * @apiSuccess {string} subleaseISUcookie Users session cookie is sent in the response.
	 *
	 * @apiUse UsernameNotFoundError
	 * @apiUse UsernameNotProvided
	 * @apiUse DatabaseError
	 *
	 * @apiSuccessExample Success-Response:
	 * HTTP/1.1 200 OK
	 * {
     *   "subleaseISUcookie" : "00bd65bab3b91ebce7693789c8478940cd61c330"
	 * }
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
	 * @apiGroup User_Authentication
	 *
	 * @apiParam {string} userName Users unique ID.
	 * @apiParam {string} subleaseISUcookie Users unique cookie.
	 *
	 * @apiSuccess {string} msg The success message "authentication accepted" is returned
	 *
	 * @apiUse UsernameNotFoundError
	 * @apiUse UsernameNotProvided
	 * @apiUse DatabaseError
	 *
	 * @apiSuccessExample Success-Response:
	 * HTTP/1.1 200 OK
	 * {
     *   "msg" : "authentication accepted"
	 * }
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
	 * @apiGroup User_Profile_Picture
	 *
	 * @apiParam {string} userName Users unique ID.
	 * @apiParam {string} username Users unique ID, is also provided in the formdata.
	 * @apiParam {string} subleaseISUcookie Users unique cookie (formdata).
	 * @apiParam {File} fileName Profile picture is sent through formdata.
	 *
	 * @apiSuccess {User} res The User Object is echoed back in the response with the new pictureLocation updated.
	 *
	 * @apiUse UsernameNotFoundError
	 * @apiUse UsernameNotProvided
	 * @apiUse DatabaseError
	 *
	 * @apiSuccessExample Success-Response:
	 * HTTP/1.1 200 OK
	 * {
     *   "_id" : ObjectId("59f8eb5fefc008260848e563"),
     *   "username" : "johnSmith34",
     *   "userType" : "regular",
     *   "favoriteProperties" : [],
     *   "userTypeApproved" : null,
     *   "email" : "test@test.test",
     *   "phoneNumber" : "1212121212",
     *   "__v" : 0,
     *   "profilePictureLocation" : "/home/matthewv/SD_B_1_ProjectName/REST/controllers/propertyPictures/Screen Shot 2017-12-03 at 1.05.46 PM.png1512336951925"
	 * }
 	 *	
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
	 * @apiGroup User_Profile_Picture
	 *
	 * @apiParam {string} userName Users unique ID.
	 * @apiParam {string} subleaseISUcookie Users unique cookie.
	 *
	 * @apiSuccess {File} fileName The profilePictureLocation file (image) is sent back asynchronously to the caller.
	 *
	 * @apiUse UsernameNotFoundError
	 * @apiUse UsernameNotProvided
	 * @apiUse DatabaseError
	 *
	 * @apiSuccessExample Success-Response:
	 * HTTP/1.1 200 OK
 	 *	
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

	/**
	 * @api {post} /getApprovals
	 * @apiName getPendingApprovals
	 * @apiGroup UserType_Approvals
	 *
	 * @apiParam {string} username Users unique ID, of the account making the request.
	 * @apiParam {string} subleaseISUcookie Users unique session cookie.
	 *
	 * @apiSuccess {User[]} res An array of User Objects (only leasers or admins) is returned.
	 *
	 * @apiUse UsernameNotFoundError
	 * @apiUse UsernameNotProvided
	 * @apiUse DatabaseError
	 *
	 * @apiSuccessExample Success-Response:
	 * HTTP/1.1 200 OK
	 * [
	 *  {
	 *    "_id": "5a230d29f4aa487aae78f9d5",
	 *    "username": "testleasingAgency",
	 *    "hashedPassword": "5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8",
	 *    "email": "abc@gmail.com",
	 *    "phoneNumber": "1234123412",
	 *    "userType": "leasing",
	 *    "__v": 0,
	 *    "userTypeApproved": false,
	 *    "favoriteProperties": []
	 *  },
	 *  {
	 *    "_id": "5a230d6af4aa487aae78f9d6",
	 *    "username": "testAdmin",
	 *    "hashedPassword": "38f2279f58fdd8ad2b6f6f62095658ab9a896c96",
	 *    "email": "test@test.com",
	 *    "phoneNumber": "1234123412",
	 *    "userType": "admin",
	 *    "__v": 0,
	 *    "userTypeApproved": null,
	 *    "favoriteProperties": []
	 *  }
	 * ]
	 */
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

	/**
	 * @api {post} /approve/{accountUsername}
	 * @apiName approveUserType
	 * @apiGroup UserType_Approvals
	 *
	 * @apiParam {string} accountUsername Users unique ID, of the account to be updated.
	 * @apiParam {string} username Users unique ID, of the account making the request.
	 * @apiParam {string} subleaseISUcookie Users unique session cookie.
	 *
	 * @apiSuccess {string} msg A success message of 'user updated' is returned
	 *
	 * @apiUse UsernameNotFoundError
	 * @apiUse UsernameNotProvided
	 * @apiUse DatabaseError
	 *
	 * @apiSuccessExample Success-Response:
	 * HTTP/1.1 200 OK
	 * {
	 *   "msg" : "user updated"
	 * }
	 */
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
