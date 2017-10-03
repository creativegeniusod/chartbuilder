var createStore = require("fluxible/addons/createStore");
var AppStore = createStore({
    storeName: "AppStore",
    handlers: {
		CHANGE_ROUTE: "handleNavigate",
		CHART_NOT_DELETED: "showChartErrors"
	},
	initialize: function() {
		this.currentRoute = null, this.appError = null
	},
	handleNavigate: function(e) {
			this.currentRoute && e.path === this.currentRoute.path || (this.currentRoute = e, this.emitChange())
	},
	showChartErrors: function(e) {
			this.appError = "Chart " + e.chart + " could not be deleted. It may have been deleted already.", this.emitChange()
	},
	getState: function() {
		return {
			route: this.currentRoute,
			appError: this.appError
		}
	},
	dehydrate: function() {
		return this.getState()
	},
	rehydrate: function(e) {
		this.currentRoute = e.route
	}
});

module.exports = AppStore;
