(function () {'use strict';

	var mongoose = require("mongoose"),
		User = mongoose.model('User');

	exports.createUser = function(req, res) {
		var newUser = new User(req.body);

		newUser.save(function (err, user) {
			if (err) {
				res.send(err);
			}
			res.json(user);
		});
	};

	exports.getSpecificUser = function(req, res) {
		User.findById(req.params.username, function (err, user) {
			if (err) {
				res.send(err);
			}
			res.json(user);
		});
	};

	exports.updateSpecificUser = function(req, res) {
		User.findOneAndUpdate({_id: req.params.username}, req.body, {new: true}, function (err, user){
			if (err) {
				res.send(err);
			}
			res.json(user);
		});
	};

	exports.deleteSpecificUser = function(req, res){
		User.remove({
			_id: req.params.username
		}, function(err, user){
			if (err) {
				res.send(err);
			}
			res.json({message: 'User successfully deleted'});
		});
	};

}());