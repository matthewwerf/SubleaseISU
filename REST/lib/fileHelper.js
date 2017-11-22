(function () {'use strict';

	var fs = require('fs');

	exports.deleteFile = function(path) {
		fs.stat(path, function(err, stats) {
			if (err) {
				return err;
			}
			fs.unlink(path, function(err) {
				if (err) {
					return err;
				}
				console.log(path + ' Was Deleted');
			});
		});
	};

}());
