(function () {'use strict';

	module.exports = function(app) {
		var message = require("../controllers/messageController.js");

		
		app.route('/messages')
			.post(message.maintainSocket);
		
		app.route('/messages/getUsernamesOfSenders')
			.post(message.getUsernamesOfSenders);

		app.route('/messages/getHistory/:usernameOfSender')
			.post(message.getHistory);

		/*
		// Should be able to implement within backend socket
		app.route('/messages/saveHistory')
			.post(message.saveHistory);
		*/
		
		// socket routes

	};

}());
