var mongoose = require("mongoose");

var messageSchema = new mongoose.Schema({
	senderUsername: String,
	receiverUsername: String,
	message: String,
	timeSent: String,
	jsTime: Date
});

module.exports = mongoose.model('Message', messageSchema);