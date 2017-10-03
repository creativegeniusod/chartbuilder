var has = require("lodash/has");
var revalidator = require("revalidator");
var valid = {
	chart: require("./chart")
};

var validation = function(e, t) {
	if (!has(valid, e)) throw new Error('Validator error: There is no template named "' + e + '".');
	return revalidator.validate(t, valid[e])
};

module.exports = validation;
