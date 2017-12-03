(function () {'use strict';

	var mongoose = require("mongoose"),
		User = mongoose.model('User');
	var sha1 = require("sha1");
	var config = require("../config.js");

	/*
	 * Returns null on error, user on success
	 */
	exports.validateAuth = function(req, res, cb) {
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
				if(user.userType) {
					if(user.userType == 'admin') {
						if(user.userTypeApproved == true) {
							handleAdmin(req, res, function(adminAccount){
								cb(adminAccount);
							});
						} else {
							res.status(400).json({
								"error" : "account is still pending approval for admin status"
							});
							cb(null);
							return;
						}
						
					} else if(user.userType == 'leasing') {
						if(user.userTypeApproved == true) {
							handleLeaser(req, res, function(leaserAccount) {
								cb(leaserAccount);
							});
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
			} else {
				res.status(400).json({
					"error": "Incorrect cookie"
				});
				cb(null);
			}
		});
	};

	function handleAdmin(req, res, adminAccount, cb) {
		cb(adminAccount);
	}

	function handleLeaser(req, res, leasingAccount, cb) {
		cb(leasingAccount);
	}

}());
