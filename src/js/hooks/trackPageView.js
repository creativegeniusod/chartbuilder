var q = require("q"),
	reduce = require("lodash/reduce"),
	assign = require("lodash/assign"),
	tracking = require("../actions/tracking"),
	trackPageView = (require("../stores/AuthStore"), function(e, t, n) {
		console.log(t.routes);
		var s = {
				prop4: t.path,
				prop28: t.routes[t.routes.length - 1].name
			},
			c = n ? tracking.initialPageView : tracking.pageView,
			u = t.routes.map(function(n) {
				return n.handler.tracking ? n.handler.tracking(e.getComponentContext(), t) : {}
			});
		return q.all(u).then(function(e) {
			return reduce(e, function(e, t) {
				return assign(e, t)
			})
		}).then(function(t) {
			return e.executeAction(c, assign(t, s))
		})
	});
module.exports = trackPageView
