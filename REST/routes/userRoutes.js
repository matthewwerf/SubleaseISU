(function () {'use strict';

	var multer = require('multer'),
                Storage = multer.diskStorage({
                        destination: function(req, file, callback) {
                                callback(null, './Images');
                        },
                        filename: function(req, file, callback) {
                                callback(null, file.fieldname + '-' + req.body.username  + '-' + Date.now());
                        }
                }),
                upload = multer({
                        storage: Storage
                });


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
		
		app.route('/retrieveProfilePicture/:username')
			.post(user.retrieveProfilePic);

		app.route('/getApprovals')
			.post(user.getPendingApprovals);

		app.route('/approve/:username')
			.post(user.approveUserType);
	};
}());
