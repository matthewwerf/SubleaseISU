(function () {'use strict';

	var mongoose = require("mongoose"),
		Property = mongoose.model('Property');
	var sha1 = require("sha1");
	var config = require("../config.js");

	exports.createProperty = function(req, res) {
		if (req.body.username && req.body.propertyID){

			var newProperty = new Property(req.body);

			newProperty.save(function (err, property) {
				if (err) {
					res.send(err);
				}
				res.json(property);
			});
		} else {
			res.send({
				"error": "username or propertyID missing"
			});
		}
	};

	exports.getSpecificProperty = function(req, res) {
		Property.findOne({propertyID: req.params.propertyID}, function (err, property) {
			if (err) {
				res.send(err);
			}
			res.json(property);
		});
	};

	exports.updateSpecificProperty = function(req, res) {
		Property.findOneAndUpdate({propertyID: req.params.propertyID}, req.body, {new: true}, function (err, property){
			if (err) {
				res.send(err);
			}
			res.json(property);
		});
	};

	exports.deleteSpecificProperty = function(req, res){
		Property.remove({
			propertyID: req.params.propertyID
		}, function(err, property){
			if (err) {
				res.send(err);
			}
			res.json({message: 'Property successfully deleted'});
		});
	};



}());