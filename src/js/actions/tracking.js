module.exports = {
    scrollPageView: function(e, t) {
		e.dispatch("SCROLL_PAGE_VIEW", t)
	},
	initialPageView: function(e, t) {
		e.dispatch("INITIAL_PAGE_VIEW", t)
	},
	pageView: function(e, t) {
		e.dispatch("PAGE_VIEW", t)
	},
	embedClick: function(e, t) {
		e.dispatch("EMBED_BUTTON", t)
	}
}
