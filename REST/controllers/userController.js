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
				console.log(req);

				var newFilename = file.fieldname + '_' + Date.now() + '_' + file.originalname;

				console.log('FILENAME: ' + newFilewname);
				/*
				// Update photo location in user data
				User.findOneAndUpdate({username: req.params.username}, {profilePictureLocation: filename}, function (err, user){
					if(user == null) { // don't forget to check this is all functions
						console.log("Username not found in file save");
						res.status(401).send({
							"error": "username not recognized"
						});
						return;
					}

					if (err) {
						//res.status(500).send(err);
						console.log("FROM FILE SAVE: " + err);
					}
					//res.status(200).json(user);
					console.log("File saved");
				});
				*/

				callback(null, newFilename);
			}
		}),
		upload = multer({
			storage: Storage
		}).single("fileName");

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
		}
	};

	exports.updateSpecificUser = function(req, res) {
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
		}
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
				if(user == null) { // don't forget to check this is all functions
					res.status(401).send({
						"error": "username not recognized"
					});
					return;
				}

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

	exports.uploadProfilePicture = function(req, res) {
		var form = formidable.IncomingForm();
		form.uploadDir = __dirname + '/tmp';
		form.encoding = 'binary';	
	
		form.addListener('file', function(name, file) {
    			// do something with uploaded filei
    			console.log(name);
       			upload(req, res, function(err){
                        	if(err){
                                	console.log(err);
                                	return res.status(500).send({
                                        	"err": "file could not be saved"
                                	});
                        	}
				
                        	return res.status(201).send({
                                	"msg": "file was uploaded"
                        	});
				
                	});
		});
    
         	form.addListener('end', function() {
             		res.end();
               	});


		form.parse(req, function(err, fields, files){
			console.log(fields);
			console.log(files);
		});
		//console.log(req);
		//console.log(form);

		//var form = new multiparty.Form();

		if (!req.body.subleaseISUcookie || !req.body.username){
			res.status(401).send({
				"error": "not authenticated"
			});
			return;
		} else {
			User.findOne({username: req.body.username}, 'hashedPassword', function(err, user){
				if(user == null) { // don't forget to check this is all functions
					res.status(401).send({
						"error": "username not recognized"
					});
					return;
				}

				var localCookieToCheck = sha1(req.body.username + user.hashedPassword + config.salt);
				if(localCookieToCheck != req.body.subleaseISUcookie) {
					res.status(401).send({
						"error": "authentication rejected"
					});
				} else {

					upload(req, res, function(err, filename){
						console.log(req.body);
						console.log(filename);
						if(err){
							console.log(err);
							return res.status(500).send({
								"err": "file could not be saved"
							});
						}

						return res.status(201).send({
							"msg": "file was uploaded"
						});
					});
				}
			});
		}



		/*
		upload(req, res, function(err){
			if(err){
				console.log(err);
				return res.status(500).send({
					"err": "file could not be saved"
				});
			}
			return res.status(201).send({
				"msg": "file was uploaded"
			});
		});
		*/
	};

	exports.retrieveProfilePic = function(req, res) {

	};

}());
