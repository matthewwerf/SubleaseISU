
(function () {'use strict';

	var mongoose = require("mongoose");
	var schema = mongoose.schema;

	var propertySchema = new Schema({
		posterUsername: String,
		leasingAgency: String,
		rentValue: Number,
		address: String,
		postingMessage: String,
		linkedPictureIDs: Array,
		propertyID: String
	});

module.exports = mongoose.model('Property', propertySchema);
}());

