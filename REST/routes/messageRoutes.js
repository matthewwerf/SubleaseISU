(function () {'use strict';

	module.exports = function(app) {
		var message = require("../controllers/messageController.js"),
			http = require('http').Server(app),
			io = require('socket.io')(http);

		/*
		app.route('/messages')
			.post(message.maintainSocket);
		*/
		io.on('connection', message.maintainSocket);

		app.route('/messages/getUsernamesOfSenders')
			.post(message.getUsernamesOfSenders);

		app.route('/messages/getHistory/:usernameOfSender')
			.post(message.getHistory);

		app.route('/messages/saveHistory')
			.post(message.saveHistory);
		
	};

}());
