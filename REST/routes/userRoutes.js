(function () {'use strict';

	module.exports = function(app) {
		var user = require("../controllers/userController");

		app.route('/users')
			.post(user.createUser);

		app.route('/users/:username')
			.get(user.getSpecificUser)
			.post(user.allowRouting)
			.put(user.updateSpecificUser)
			.delete(user.deleteSpecificUser);

		app.route('/login/:username')
			.post(user.authAndReturnCookie);

		app.route('/uploadProfilePicture/:username')
			.post(user.uploadProfilePicture);

		app.route('/retrieveProfilePic/:username')
			.post(user.retrieveProfilePic);
	};
}());
