(function () {'use strict';

	module.exports = function(app) {
		var property = require("../controllers/propertyController");

		app.route('/property')
			.post(property.createProperty);

		app.route('/property/:propertyID')
			.get(property.getSpecificProperty)
			.put(user.updateSpecificProperty)
			.delete(user.deleteSpecificProperty);
	};
}());