var mongoose = require("mongoose");
var schema = mongoose.schema;

var propertySchema = new Schema({
	posterUsername: String,
	leasingAgency: String,
	rentValue: Number,
	address: String,
	longitude: String,
	latitude: String,
	postingMessage: String,
	linkedPictureIDs: Array,
	properyID: String
});

module.exports = mongoose.model('Property', propertySchema);