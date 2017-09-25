var mongoose = require("mongoose");
var schema = mongoose.schema;

var messageSchema = new Schema({
	senderUsername: String,
	receiverUsername: String,
	message: String,
	timeSent: String
});

module.exports = mongoose.model('Message', messageSchema);