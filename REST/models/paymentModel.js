var mongoose = require("mongoose");
var schema = mongoose.schema;

var paymentSchema = new Schema({
	senderUsername: String,
	receiverUsername: String,
	paymentAmount: Number,
	timeSent: String,
	timeVerified: String
});

module.exports = mongoose.model('Payment', paymentSchema);