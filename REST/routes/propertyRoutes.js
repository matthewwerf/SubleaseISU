(function () {'use strict';

	module.exports = function(app) {
		var property = require("../controllers/propertyController");

		app.route('/property')
			.post(property.createProperty);

		app.route('/listAllProperties')
			.post(property.listAllProperties);

		app.route('/property/:propertyID')
			.get(property.getSpecificProperty)
			.put(property.updateSpecificProperty)
			.delete(property.deleteSpecificProperty);
	};
}());