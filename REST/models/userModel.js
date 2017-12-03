(function () {'use strict';

	var mongoose = require("mongoose");

	var userSchema = new mongoose.Schema({
		username: String,
		userType: String,
		userTypeApproved: Boolean,
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