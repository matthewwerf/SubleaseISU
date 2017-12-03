(function () {'use strict';

	var mongoose = require("mongoose"),
		Property = mongoose.model('Property'),
		User = mongoose.model('User'),
		sha1 = require("sha1"),
		config = require("../config.js");

	// Library to make requests
	var axios = require('axios');

	// Config for seperate env configurations
	var nodeConfig = require('config');

	// Library to send email
	var nodemailer = require('nodemailer'),
		transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: nodeConfig.NODEMAILER_EMAIL_USERNAME,
				pass: nodeConfig.NODEMAILER_EMAIL_PASSWORD
			}
		});

	const nodemailerEmail = nodeConfig.NODEMAILER_EMAIL;

	// Formdata
	var formidable = require('formidable');

	// Auth Helper
	var ah = require('../lib/authHelper.js');

	// File Helper
	var fh = require('../lib/fileHelper.js');

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


	// NEED TO ADD FALLBACK WHEN LONG LAT IS NULL

	/**
	 * @api {post} /property
	 * @apiName createroperty
	 * @apiGroup Property
	 *
	 * @apiParam {string} username Users unique ID.
	 * @apiParam {string} subleaseISUcookie Users upique cookie.
	 * @apiParam {string} propertyID Unique ID associated with property.
	 * @apiParam {string} posterUsername Username of account creating a new property listing.
	 * @apiParam {string} leasingAgency The name of the property's leasing agency.
	 * @apiParam {number} rentValue The dollar amount of a month's rent.
	 * @apiParam {string} address The address of the property.
	 * @apiParam {string} postingMessage The description the user provides.
	 * @apiParam {number} bathroomQuantity The number of bathrooms.
	 * @apiParam {number} roommateQuantity The number of roommates.
	 * @apiParam {boolean} personalBathroom Whether the posting has a personal bathroom for the renter.
	 *
	 * @apiSuccess {Property} res The property is echoed in response of the error message is returned.
	 *
	 * @apiUse UsernameNotFoundError
	 * @apiUse UsernameNotProvided
	 * @apiUse DatabaseError
	 *
	 * @apiSuccessExample Success-Response:
	 *     HTTP/1.1 200 OK
	 *     {
	 *	  "_id": "5a1601b55de8fd2455f02392",
	 *	  "personalBathroom": false,
	 *	  "bathroomQuantity": 3,
	 *	  "roommateQuantity": 1,
	 *	  "posterUsername": "username",
	 *	  "leasingAgency": "dfd",
	 *    "milesFromMU": 0.8,
	 *	  "rentValue": 2322222,
	 *	  "address": "223 Lynn Avenue, Ames, Iowa 50014",
	 *	  "postingMessage": "22",
	 *	  "propertyID": "94b730f94a0c72a2c023099a62c78f59a2bd097b",
	 *	  "longitude": "-93.64681569999999",
	 *	  "latitude": "42.02074409999999",
	 *	  "__v": 0,
	 *	  "comments": [
	 *	    {
	 *	      "message": "This is a new comment ",
	 *	      "timePosted": "2017:11:27:14:55:15",
	 *	      "commentPosterUsername": "matt"
	 *	    },
	 *	    {
	 *	      "commentPosterUsername": "matt",
	 *	      "timePosted": "2017:11:27:14:55:26",
	 *	      "message": "This is a new comment 2"
	 *	    }
	 *	  ],
	 *	  "ratings": [
	 *	    {
	 *	      "ratingPosterUsername": "matt",
	 *	      "timePosted": "2017:11:30:12:28:31",
	 *	      "rating": 5
	 *	    },
	 *	    {
	 *	      "rating": 3,
	 *	      "timePosted": "2017:11:30:12:28:34",
	 *	      "ratingPosterUsername": "matt"
	 *	    },
	 *	    {
	 *	      "ratingPosterUsername": "matt",
	 *	      "timePosted": "2017:11:30:12:28:38",
	 *	      "rating": 3
	 *	    }
	 *	  ],
	 *	  "linkedPictureIDs": ["/home/matthewv/SD_B_1_ProjectName/REST/controllers/profilePictures/KENNETH\ HO.jpg1511"]
	 *	}
	 *
	 */
	exports.createProperty = function(req, res) {
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
					return;
				}
			});
		}

		if (req.body.propertyID){

			var newProperty = new Property(req.body);

			// Get long lat from google api
			if(req.body.address) {
				var options = {
					host: 'maps.googleapis.com',
					port: 80,
					path: '/maps/api/geocode/json?address=' + encodeURIComponent(req.body.address) + '&key=AIzaSyCbDvpWBiyq0h_HNWBgMcD1iGAhxg-L37c',
					method: 'GET'
				};

				var base_URL = 'https://maps.googleapis.com';
				var full_URL = base_URL + '/maps/api/geocode/json?address=' + encodeURIComponent(req.body.address) + '&key=AIzaSyCbDvpWBiyq0h_HNWBgMcD1iGAhxg-L37c';
				
				axios.get(full_URL)
					.then(function(response) {
						var longLat = response.data.results[0].geometry.location;
						var newObj = req.body;

						newObj.longitude = longLat.lng;
						newObj.latitude = longLat.lat;

						var distance_matrix_url = 'https://maps.googleapis.com/maps/api/distancematrix/json?origins=' + encodeURIComponent(req.body.address) + '&destinations=Memorial%20Union%20Iowa%20State&mode=walking&language=en-&key=AIzaSyCbDvpWBiyq0h_HNWBgMcD1iGAhxg-L37c';
						axios.get(distance_matrix_url)
							.then(function(distance_matrix_response) {
								newObj.milesFromMU = parseFloat(distance_matrix_response.data.rows[0].elements[0].distance.text);
								newProperty = new Property(newObj);
		
								newProperty.save(function (err, property) {
									if (err) {
										res.status(500).send(err);
									}
									res.status(201).json(property);
								});							
	
							})
							.catch(function(err) {
								console.log(err);
								newProperty.save(function (err, property) {
									if (err) {
										res.status(500).send(err);
									}
									res.status(201).json(property);
								});
							});
					})
					.catch(function(err) {
						console.log(err);
						newProperty.save(function (err, property) {
							if (err) {
								res.status(500).send(err);
							}
							res.status(201).json(property);
						});
					});

			}
		} else {
			res.status(400).send({
				"error": "username or propertyID missing"
			});
		}
	};


	/**
	 * @api {post} /property/{propertyID}
	 * @apiName getSpecificProperty
	 * @apiGroup Property
	 *
	 * @apiParam {string} username Users unique ID.
	 * @apiParam {string} subleaseISUcookie Users upique cookie.
	 * @apiParam {string} propertyID Unique ID associated with property.
	 *
	 * @apiSuccess {Property} res The property associated with the propertyID is returned.
	 *
	 * @apiUse UsernameNotFoundError
	 * @apiUse UsernameNotProvided
	 * @apiUse DatabaseError

	 * @apiSuccessExample Success-Response:
	 *     HTTP/1.1 200 OK
	 *     {
	 *	  "_id": "5a1601b55de8fd2455f02392",
	 *	  "personalBathroom": false,
	 *	  "bathroomQuantity": 3,
	 *	  "roommateQuantity": 1,
	 *	  "posterUsername": "username",
	 *	  "leasingAgency": "dfd",
	 *	  "rentValue": 2322222,
	 *	  "address": "223 Lynn Avenue, Ames, Iowa 50014",
	 *	  "postingMessage": "22",
	 *	  "propertyID": "94b730f94a0c72a2c023099a62c78f59a2bd097b",
	 *	  "longitude": "-93.64681569999999",
	 *	  "latitude": "42.02074409999999",
	 *	  "__v": 0,
	 *	  "comments": [
	 *	    {
	 *	      "message": "This is a new comment ",
	 *	      "timePosted": "2017:11:27:14:55:15",
	 *	      "commentPosterUsername": "matt"
	 *	    },
	 *	    {
	 *	      "commentPosterUsername": "matt",
	 *	      "timePosted": "2017:11:27:14:55:26",
	 *	      "message": "This is a new comment 2"
	 *	    }
	 *	  ],
	 *	  "ratings": [
	 *	    {
	 *	      "ratingPosterUsername": "matt",
	 *	      "timePosted": "2017:11:30:12:28:31",
	 *	      "rating": 5
	 *	    },
	 *	    {
	 *	      "rating": 3,
	 *	      "timePosted": "2017:11:30:12:28:34",
	 *	      "ratingPosterUsername": "matt"
	 *	    },
	 *	    {
	 *	      "ratingPosterUsername": "matt",
	 *	      "timePosted": "2017:11:30:12:28:38",
	 *	      "rating": 3
	 *	    }
	 *	  ],
	 *	  "linkedPictureIDs": ["/home/matthewv/SD_B_1_ProjectName/REST/controllers/profilePictures/KENNETH\ HO.jpg1511"]
	 *	}
	 *
	 */
	exports.getSpecificProperty = function(req, res) {
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
					return;
				}
			});
		}

		Property.findOne({propertyID: req.params.propertyID}, function (err, property) {
			if (err) {
				res.status(500).send(err);
				return;
			}
			res.status(200).json(property);
		});
	};

	/**
	 * @api {put} /property/{propertyID}
	 * @apiName updateSpecificProperty
	 * @apiGroup Property
	 *
	 * @apiParam {string} username Users unique ID.
	 * @apiParam {string} subleaseISUcookie Users upique cookie.
	 * @apiParam {string} propertyID Unique ID associated with property.
	 * @apiParam {string} PROPERTY_OBJECT_ATTRIBUTE Any other property model attributes can be added and will be updated in the database.
	 *
	 * @apiSuccess {Property} res The update property object is echoed back or an error code is returned.
	 *
	 * @apiUse UsernameNotFoundError
	 * @apiUse UsernameNotProvided
	 * @apiUse DatabaseError
	 *
	 */
	exports.updateSpecificProperty = function(req, res) {
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
					return;
				}
			});
		}

		Property.findOneAndUpdate({propertyID: req.params.propertyID}, req.body, {new: true}, function (err, property){
			if (err) {
				res.status(500).send(err);
			}
			res.status(200).json(property);
		});
	};

	/**
	 * @api {delete} /property/{propertyID}
	 * @apiName deleteSpecificProperty
	 * @apiGroup Property
	 *
	 * @apiParam {string} username Users unique ID.
	 * @apiParam {string} subleaseISUcookie Users upique cookie.
	 * @apiParam {string} propertyID Unique ID associated with property.
	 *
	 * @apiSuccess {string} message Message is echo back confirming deletion
	 *
	 * @apiUse UsernameNotFoundError
	 * @apiUse UsernameNotProvided
	 * @apiUse DatabaseError
	 *
	 */
	exports.deleteSpecificProperty = function(req, res){
		if (!req.body.subleaseISUcookie || !req.body.username){
			res.status(401).send({
				"error": "not authenticated"
			});
			return;
		} else {
			User.findOne({username: req.body.username}, 'hashedPassword', function(err, user){
				localCookieToCheck = sha1(req.body.username + user.hashedPassword + config.salt);
				if(localCookieToCheck != req.body.subleaseISUcookie) {
					res.status(401).send({
						"error": "authentication rejected"
					});
					return;
				}
			});
		}
		
		Property.remove({
			propertyID: req.params.propertyID
		}, function(err, property){
			if (err) {
				res.status(500).send(err);
			}
			res.status(200).json({message: 'Property successfully deleted'});
		});
	};


	/**
	 * @api {post} /listAllProperties
	 * @apiName listAllProperties
	 * @apiGroup Property
	 *
	 * @apiParam {string} username Users unique ID.
	 * @apiParam {string} subleaseISUcookie Users upique cookie.
	 *
	 * @apiSuccess {Property[]} res Array of properties is echoed back in the response.
	 *
	 * @apiUse UsernameNotFoundError
	 * @apiUse UsernameNotProvided
	 * @apiUse DatabaseError
	 *
	 */
	exports.listAllProperties = function(req, res){
		
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
					Property.find({}, function(err, properties){
						if (err) {
							res.status(500).send(err);
						}
						res.status(200).json(properties);
					});
				}
			});
		}
	};

	/**
	 * @api {post} /emailOwner/{propertyID}
	 * @apiName sendEmailToPropertyOwner
	 * @apiGroup Property
	 *
	 * @apiParam {string} username Users unique ID.
	 * @apiParam {string} subleaseISUcookie Users upique cookie.
	 * @apiParam {string} propertyID Unique propertyID.
	 * @apiParam {string} subject Email subject.
	 * @apiParam {string} messageHTML The text content of the email.
	 *
	 * @apiSuccess {string} msg Success or error message is returned.
	 *
	 * @apiUse UsernameNotFoundError
	 * @apiUse UsernameNotProvided
	 * @apiUse DatabaseError
	 *
	 */
	exports.sendEmailToPropertyOwner = function(req, res) {
		ah.validateAuth(req, res, function(user) {
			if(user != null) {
				Property.findOne({propertyID: req.params.propertyID}, function(err, property){
					if(err) {
						res.status(500).send(err);
						return;
					} else if (property == null) {
						res.status(404).json({
							"msg": "propertyID could not be found"
						});
						return;
					}
					
					User.findOne({username: property.posterUsername}, function(err, propertyOwner) {
						if (err) {
							res.status(500).send(err);
							return;
						} else if(propertyOwner == null) {
							res.status(404).json({
								"msg": "property posterUsername could not be found"
							});
							return;
						} else if(propertyOwner.email == null) {
							res.status(400).json({
								"msg": "property owner did not provide email address"
							});
							return;
						}

						const mailOptions = {
							from: nodemailerEmail,
							to: propertyOwner.email,
							subject: req.body.subject,
							html: req.body.messageHTML
						};

						transporter.sendMail(mailOptions, function(err, info) {
							if (err) {
								res.status(500).send(err);
								return;
							}
							res.status(200).json({
								"msg": "Message successfully sent"
							});
						});

					});

				});
			}
		});
	};

	/**
	 * @api {post} /propertyComment/{propertyID}
	 * @apiName addComment
	 * @apiGroup Property
	 *
	 * @apiParam {string} username Users unique ID.
	 * @apiParam {string} subleaseISUcookie Users upique cookie.
	 * @apiParam {string} commentPosterUsername Username of the comment's poster.
	 * @apiParam {string} message The text of the comment.
	 *
	 * @apiSuccess {Property} res The updated property object is returned with the new comment appended to the array of comments.
	 *
	 * @apiUse UsernameNotFoundError
	 * @apiUse UsernameNotProvided
	 * @apiUse DatabaseError
	 *
	 */
	exports.addComment = function(req, res) {
		ah.validateAuth(req, res, function(user) {
			if(user != null) {
				Property.findOne({propertyID: req.params.propertyID}, function(err, property){
					if(err) {
						res.status(500).send(err);
						return;
					} else if (property == null) {
						res.status(404).json({
							"msg": "propertyID could not be found"
						});
						return;
					}

					var propertyComments = property.comments;
					if(propertyComments == null) {
						propertyComments = [];
					}

					var newComment = {
						commentPosterUsername: req.body.username,
						timePosted: getDateTime(),
						message: req.body.message
					};

					propertyComments.push(newComment);

					var updatedProperty = property;
					updatedProperty.comments = propertyComments;
					
					Property.findOneAndUpdate({propertyID: req.params.propertyID}, updatedProperty, {new: true}, function (err, property){
						if (err) {
							res.status(500).send(err);
						}
						res.status(200).json(property);
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
	 * @api {post} /propertyRating/{propertyID}
	 * @apiName addRating
	 * @apiGroup Property
	 *
	 * @apiParam {string} username Users unique ID.
	 * @apiParam {string} subleaseISUcookie Users upique cookie.
	 * @apiParam {string} ratingPosterUsername Username of the rating's poster.
	 * @apiParam {number} rating The number rating from 1-5.
	 *
	 * @apiSuccess {Property} res The updated property object is returned with the new rating appended to the array of ratings.
	 *
	 * @apiUse UsernameNotFoundError
	 * @apiUse UsernameNotProvided
	 * @apiUse DatabaseError
	 *
	 */
	exports.addRating = function(req, res) {
		ah.validateAuth(req, res, function(user) {
			if(user != null) {
				Property.findOne({propertyID: req.params.propertyID}, function(err, property){
					if(err) {
						res.status(500).send(err);
						return;
					} else if (property == null) {
						res.status(404).json({
							"msg": "propertyID could not be found"
						});
						return;
					}

					var propertyRatings = property.ratings;
					if(propertyRatings == null) {
						propertyRatings = [];
					}

					var rateInt = parseInt(req.body.rating);
					if(rateInt == null || rateInt < 1 || rateInt > 5) {
						res.status(400).json({
							"msg" : "rating was not an integer between 1 and 5"
						});
						return;
					}

					var newRating = {
						ratingPosterUsername: req.body.username,
						timePosted: getDateTime(),
						rating: rateInt
					};

					propertyRatings.push(newRating);

					var updatedProperty = property;
					updatedProperty.ratings = propertyRatings;
					
					Property.findOneAndUpdate({propertyID: req.params.propertyID}, updatedProperty, {new: true}, function (err, property){
						if (err) {
							res.status(500).send(err);
						}
						res.status(200).json(property);
					});

				});
			}
		});
	};

	/**
	 * @api {get} /propertyRating/{propertyID}
	 * @apiName retrieveRating
	 * @apiGroup Property
	 *
	 * @apiParam {string} username Users unique ID.
	 * @apiParam {string} subleaseISUcookie Users upique cookie.
	 *
	 * @apiSuccess {number} avgRating The average rating is calculated and returned.
	 *
	 * @apiUse UsernameNotFoundError
	 * @apiUse UsernameNotProvided
	 * @apiUse DatabaseError
	 *
	 */
	exports.retrieveRating = function(req, res) {
		Property.findOne({propertyID: req.params.propertyID}, function(err, property){
			if(err) {
				res.status(500).send(err);
				return;
			}
			if (property == null) {
				res.status(404).json({
					"msg": "propertyID not found"
				});
				return;
			}

			var sum = 0, count =0;
			for (var rating in property.ratings) {
				sum += property.ratings[rating].rating;
				count++;
			}

			res.status(200).json({
				"avgRating" : sum/count
			});
		});
	};

	exports.uploadPropertyPictures = function(req, res) {
		var form = formidable.IncomingForm();
		var fileLocations = [];

		form.parse(req, function(err, fields, files) {
			
			if (!fields.subleaseISUcookie || !fields.username) {
				res.status(401).send({
					"error": "not authenticated"
				});
				for(let file in fileLocations){
					fh.deleteFile(fileLocations[file]);
					console.log('Unauthorized, File Deteled: ' + fileLocations[file]);
				}
				return;
			} else {
				User.findOne({username: fields.username}, function(err, user){
					if(err){
						res.status(500).send(err);
						return;
					}
					if(user == null) { // don't forget to check this is all functions
						res.status(401).send({
							"error": "username not recognized"
						});
						for(let file in fileLocations){
							fh.deleteFile(fileLocations[file]);
							console.log('Unauthorized, File Deteled: ' + fileLocations[file]);
						}
						return;
					}
		
					var localCookieToCheck = sha1(fields.username + user.hashedPassword + config.salt);
					if(localCookieToCheck != fields.subleaseISUcookie) {
						res.status(401).send({
							"error": "authentication rejected"
						});

						for(let file in fileLocations){
							fh.deleteFile(fileLocations[file]);
							console.log('Unauthorized, File Deteled: ' + fileLocations[file]);
						}
						return;

					} else {
						// if authentication is accepted add listeners to save file
						console.log("Authentication Accepted");

						Property.findOneAndUpdate({propertyID: fields.propertyID}, {linkedPictureIDs: fileLocations}, {new: true}, function(err, user) {
							if(user == null) { // don't forget to check this is all functions
								res.status(401).send({
									"error": "propertyID not recognized"
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
			file.path = __dirname + '/propertyPictures/' + file.name + Date.now();
			fileLocations.push(file.path);
			console.log("File Path Created");
		});

		form.addListener('file', function(name, file) {
			console.log("File Detected");
		});

		form.addListener('end', function() {
			console.log('Saved at: ' + fileLocations);
		});

	};

	exports.retrievePropertyPictures = function(req, res) {

	};


}());
