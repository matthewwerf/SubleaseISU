var mongoose = require("mongoose");

var messageSchema = new mongoose.Schema({
	senderUsername: String,
	receiverUsername: String,
	message: String,
	lastMessage: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', messageSchema);