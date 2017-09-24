var createStore = require("fluxible/addons/createStore");

var ChartStore = createStore({
	storeName: "ChartStore",
	handlers: {
		RECEIVE_CHART: "handleContentChange",
		RECEIVE_SPONSORS: "handleListSponsors",
		LIST_SPONSORS_START: "prepareForSponsorList"
	},
	initialize: function() {
		this._store = {}, this.sponsors = null
	},
	handleContentChange: function(e) {
		this._store = e.chart, this.emitChange()
	},
	prepareForSponsorList: function() {
		this.sponsors = [], this.emitChange()
	},
	handleListSponsors: function(e) {
		this.sponsors = e.sponsors, this.emitChange()
	},
	getState: function() {
		return this._store
	},
	dehydrate: function() {
		return this.getState()
	},
	rehydrate: function(e) {
		this._store = e
	}
});

module.exports = ChartStore;
