var r = require("q"),
i = function(e, t, n, i, a) {
	var o = !1,
		s = t.routes.map(function(r) {
			return !r.handler.afterFetch || r.handler.afterFetch(e.getComponentContext(), t, n, i, a)
		});
	return r.all(s).then(function() {
		if (o) throw new Error("abort promise chain")
	})
};
module.exports = i
