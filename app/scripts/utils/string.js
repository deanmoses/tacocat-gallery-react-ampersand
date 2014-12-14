'use strict';

//
// string utilities
//
module.exports = {
    endsWith: function(s, suffix) {
        return !!s && s.indexOf(suffix, this.length - suffix.length) !== -1;
    }
};
