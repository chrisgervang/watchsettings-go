var Firebase 	= require('firebase'),
	_ 			= require('lodash');
var debug = require('debug')('harvest:heartbeat');
var db = function(root) {
	this.root = new Firebase('https://watch-settings.firebaseio.com/' + root);

	this.loadAsArrayOfObjects = function(cb) {
		//console.log(this);
		var elements = [];
		var that = this;
		that.root.once('value', function(snapshot){
			//console.log(snapshot.val());
			var eleCount = _.size(snapshot.val());

			debug("COUNTTTT " + eleCount);
			var count = 0;
			cb(_.toArray(snapshot.val()));
		});
	}
	this.loadAsObjectList = function(cb) {
		var that = this;
		that.root.once('value', function(snapshot) {
			cb(snapshot.val());
		})
	}
}

module.exports = db;
