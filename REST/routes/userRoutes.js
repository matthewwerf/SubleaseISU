(function () {'use strict';

	module.exports = function(app) {
		var user = require("../controllers/userController");

		app.use(function(req, res, next) {
			res.header("Access-Control-Allow-Origin", "*");
			res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
			res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
		  next();
		});

		app.route('/users')
			.post(user.createUser);

		app.route('/users/:username')
			.get(user.getSpecificUser)
			.put(user.updateSpecificUser)
			.delete(user.deleteSpecificUser);

		app.route('/login/:username')
			.post(user.authAndReturnCookie);
	};
}());
