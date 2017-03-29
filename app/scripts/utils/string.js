'use strict';

//
// string utilities
//
module.exports = {
    endsWith: function(s, suffix) {
    	return !!s &&  s.slice(-suffix.length) === suffix;
    }
};