var fluxible = require("fluxible/addons/createStore");
var AuthStore = require("../stores/AuthStore");
var omniture = require("../utils/omniture");
var chartbeat = require("../utils/chartbeat");
var comscore = require("../utils/comscore");
var keen = require("../utils/keen");
var get	= require("lodash/get");
	
	TrackingStore = fluxible({
		storeName: "TrackingStore",
		
		handlers: {
			INITIAL_PAGE_VIEW: "trackInitialPageView",
			PAGE_VIEW: "trackPageView",
			EMBED_BUTTON: "chartEmbed",
			GET_MORE_ARCHIVE: "trackArchiveScrollView",
			SCROLL_PAGE_VIEW: "trackScrollView"
		},
		
		trackInitialPageView: function(e) {
			omniture.trackPageView(e), keen.trackEvent(e)
		},
		
		trackPageView: function(e) {
			var t = e.prop4;
			//omniture.trackPageView(e), chartbeat.trackPageView(e), keen.trackEvent(e), comscore.trackPageView(t)
		},
		
		chartEmbed: function(e) {
			omniture.trackEvent(e), keen.trackEvent(e)
		},
		
		trackArchiveScrollView: function(e) {
			var t, n = e.context && e.context.getStore(i).isAuth() ? e.context.getStore(i).user : {};
			t = "tag" === e.subtype ? e.body.tag : "search" === e.subtype ? e.body.q : "user" === e.subtype ? e.body.user._id : e.subtype;
			var r = {
					keen: {
						user: n,
						type: "archive",
						subtype: e.subtype,
						term: t,
						archive: e.body
					}
				},
				a = get(e, "body.pagination.page", 1),
				o = get(e, "body.pagination.limit", 20),
				l = "/charts/" + t + "/?page=" + a + "&limit=" + o;
			chartbeat.trackPageView(l), keen.trackEvent(r)
		},
		
		trackScrollView: function(e) {
			var t, n = e.context && e.context.getStore(i).isAuth() ? e.context.getStore(i).user : {};
			if ("chart" === e.props.type) t = {
				user: n,
				type: e.props.type,
				chart: e.props.chart,
				causalEventType: "scroll"
			};
			else if ("archive" === e.props.type) t = {
				user: n,
				type: e.props.type,
				subtype: e.props.subtype,
				term: null,
				archive: e.props.archiveState,
				causalEventType: "scroll"
			};
			else {
				if ("home" !== e.props.type) return;
				t = {
					type: "page",
					subtype: "home"
				}
			}
			keen.trackEvent({
				keen: t
			})
		}
	});
	
module.exports = TrackingStore;
