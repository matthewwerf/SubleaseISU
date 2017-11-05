(function () {'use strict';

	var mongoose = require("mongoose");

	var userSchema = new mongoose.Schema({
		username: String,
		hashedPassword: String,
		email: String,
		phoneNumber: String,
		venmoUsername: String,
		venmoEncryptedPassword: String,
		paypalUsername: String,
		paypalEncryptedPassword: String,
		favoriteProperties: Object,
		profilePictureLocation: String
	});

	module.exports = mongoose.model('User', userSchema);

}());