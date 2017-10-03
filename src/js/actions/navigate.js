module.exports = {
	navigate: function(actionContext, payload) {
		return actionContext.dispatch("CHANGE_ROUTE", payload);
	}
}
