'use strict';

//
// date utilities
//
module.exports = {
	shortDate: function(seconds) {
		var month_names = new Array('Jan', 'Feb', 'Mar', 
		'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 
		'Oct', 'Nov', 'Dec');

		var d = new Date(seconds*1000);
		var curr_day = d.getDate();
		var curr_month = d.getMonth();
		return month_names[curr_month] + ' ' + curr_day;
	},
	
	year: function(seconds) {
		var d = new Date(seconds*1000);
		return '' + d.getFullYear();
	}
};