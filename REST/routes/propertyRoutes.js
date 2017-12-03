(function () {'use strict';

	module.exports = function(app) {
		var property = require("../controllers/propertyController");

		app.route('/properties')
			.post(property.createProperty);

		app.route('/propertyPictures/:propertyID')
			.post(property.uploadPropertyPictures);

		app.route('/retrievePropertyPictures/:propertyID')
			.post(property.retrievePropertyPictures);

		app.route('/listAllProperties')
			.post(property.listAllProperties);

		app.route('/property/:propertyID')
			.post(property.getSpecificProperty)
			.put(property.updateSpecificProperty)
			.delete(property.deleteSpecificProperty);

		app.route('/propertyComment/:propertyID')
			.post(property.addComment);

		app.route('/propertyRating/:propertyID')
			.get(property.retrieveRating)
			.post(property.addRating);

		app.route('/emailOwner/:propertyID')
			.post(property.sendEmailToPropertyOwner);

	};
}());
