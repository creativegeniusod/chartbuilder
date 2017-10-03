var r = require("q"),
	i = "undefined" != typeof window,
	beforeFetch = function(e, t, n, a) {
		var o = !1,
			s = function(e, r) {
				i ? n.transitionTo(e, {}, {
					nextPath: t.path
				}) : a.redirect(r), o = !0
			},
			c = t.routes.map(function(n) {
				return !n.handler.beforeFetch || n.handler.beforeFetch(e.getComponentContext(), t.params, t.query, s)
			});
		return r.all(c).then(function() {
			if (o) throw new Error("abort promise chain")
		})
	};
module.exports = beforeFetch
