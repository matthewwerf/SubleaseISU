(function () {'use strict';

	var mongoose = require("mongoose");

	var propertySchema = new mongoose.Schema({
		posterUsername: String,
		leasingAgency: String,
		rentValue: Number,
		address: String,
		postingMessage: String,
		linkedPictureIDs: Array,
		propertyID: String,
		longitude: String,
		latitude: String,
		bathroomQuantity: Number,
		roommateQuantity: Number,
		personalBathroom: Boolean,
		comments: Object
	});

	module.exports = mongoose.model('Property', propertySchema);
}());

