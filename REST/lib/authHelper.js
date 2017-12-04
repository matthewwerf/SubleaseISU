(function () {'use strict';

	var mongoose = require("mongoose"),
		User = mongoose.model('User');
	var sha1 = require("sha1");
	var config = require("../config.js");

	/*
	 * Returns null on error, user on success
	 */
	var validateAuthInternal = function(req, res, cb) {
	var queryUsername;
		if(req.params.username != null) {
			queryUsername = req.params.username;
		} else if(req.body.username != null) {
			queryUsername = req.body.username;
		} else {
			res.status(400).json({
				"msg" : "username not provided in request"
			});
			return;
		}
		User.findOne({username: queryUsername}, function (err, user) {
			if(user == null) { // don't forget to check this is all functions
				res.status(401).send({
					"error": "username not recognized"
				});
				cb(null);
				return;
			}

			if (err) {
				res.status(500).send(err);
				cb(null);
				return;
			}
			var localCookieToCheck = sha1(queryUsername + user.hashedPassword + config.salt);
			if (localCookieToCheck == req.body.subleaseISUcookie){
				/*
				if(user.userType) {
					if(user.userType == 'admin') {
						if(user.userTypeApproved == true) {
							cb(adminAccount);
						} else {
							res.status(400).json({
								"error" : "account is still pending approval for admin status"
							});
							cb(null);
							return;
						}
						
					} else if(user.userType == 'leasing') {
						if(user.userTypeApproved == true) {
							cb(leaserAccount);
						} else {
							res.status(400).json({
								"error" : "account is still pending approval for leasing status"
							});
							cb(null);
							return;
						}
					}
				} else {
					cb(user);
				}
				*/
				cb(user);
			} else {
				res.status(400).json({
					"error": "Incorrect cookie"
				});
				cb(null);
			}
		});
	};

	exports.validateAuth = validateAuthInternal;

	exports.tieredPropertyAuth = function(req, res, property, cb) {
		validateAuthInternal(req, res, function(user){
			if(user != null) {
				if(user.userType) {
					// if admin, return property
					if(user.userType == 'admin') {
						if(user.userTypeApproved == true) {
							cb(true);
						} else {
							res.status(401).json({
								"error" : "account is still pending approval for admin status"
							});
							cb(false);
							return;
						}
					// if leaser, return property onlyIf, property.leasingAgency == leasingAccount.username
					} else if(user.userType == 'leasing') {
						if(user.userTypeApproved == true) {
							if(user.username == property.leasingAgency) {
								cb(true);
							}
							else {
								res.status(401).json({
									"error" : "Leasing agency name does not match that of the property"
								});
								cb(false);
								return;
							}
						} else {
							res.status(401).json({
								"error" : "account is still pending approval for leasing status"
							});
							cb(false);
							return;
						}
					// if user, return property onlyIf, property.posterUsername == user.username
					} else { // userType is regular
						if(user.username == property.posterUsername) {
							cb(true);
							return;
						} else {
							res.status(401).json({
								"error" : "you are not the poster of this property"
							});
							cb(false);
							return;
						}
					}
				// if user, return property onlyIf, property.posterUsername == user.username
				} else { // userType not sent (assume regular)
					if(user.username == property.posterUsername) {
						cb(true);
						return;
					} else {
						res.status(401).json({
							"error" : "you are not the poster of this property"
						});
						cb(false);
						return;
					}
				}
			}
		});
	};

}());
