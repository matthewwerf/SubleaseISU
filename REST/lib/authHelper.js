(function () {'use strict';

	var mongoose = require("mongoose"),
		User = mongoose.model('User');
	var sha1 = require("sha1");
	var config = require("../config.js");

	/*
	 * Returns null on error, user on success
	 */
	exports.validateAuth = function(req, res, cb) {
		User.findOne({username: req.params.username}, 'hashedPassword', function (err, user) {
			if(user == null) { // don't forget to check this is all functions
				res.status(401).send({
					"error": "username not recognized"
				});
				cb(null);
			}

			if (err) {
				res.status(500).send(err);
				cb(null);
			}
			if (user.hashedPassword == req.body.hashedPassword){
				console.log("success");
				cb(user);
			} else {
				res.status(400).json({
					"error": "Incorrect password."
				});
				cb(null);
			}
		});
	};

}());
