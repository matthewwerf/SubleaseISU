(function () {'use strict';

	var mongoose = require("mongoose"),
		Property = mongoose.model('Property'),
		User = mongoose.model('User'),
		sha1 = require("sha1"),
		config = require("../config.js");

	var axios = require('axios');

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


				console.log("Hello");
				
				axios.get(full_URL)
					.then(function(res) {
						var longLat = res.data.results[0].geometry.location;
						var newObj = req.body;

						newObj.longitude = longLat.lng;
						newObj.latitude = longLat.lat;
						newProperty = new Property(newObj);

						//console.log(newProperty);

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

			}


			/*
			newProperty.save(function (err, property) {
				if (err) {
					res.status(500).send(err);
				}
				res.status(201).json(property);
			});
			*/
		} else {
			res.status(400).send({
				"error": "username or propertyID missing"
			});
		}
	};

	exports.getSpecificProperty = function(req, res) {
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

		Property.findOne({propertyID: req.params.propertyID}, function (err, property) {
			if (err) {
				res.status(500).send(err);
			}
			res.status(200).json(property);
		});
	};

	exports.updateSpecificProperty = function(req, res) {
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

		Property.findOneAndUpdate({propertyID: req.params.propertyID}, req.body, {new: true}, function (err, property){
			if (err) {
				res.status(500).send(err);
			}
			res.status(200).json(property);
		});
	};

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


}());
