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
		//console.log(req);
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
		var fileLocation = null;
		var auth = false;
		var waitingOnAuth = true;

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
						auth = true;
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

	/*
	exports.handlePhotoLocation = function(req, res, next) {
		console.log("Handle Photo Function:");
		console.log(req.fileName);
		//console.log(res.file);
	};
	*/

	exports.retrieveProfilePic = function(req, res) {

	};

}());
