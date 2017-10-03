var r = require("q"),
	fetchData = function(e, t) {
		var n = t.routes;
		if (0 === n.length) return r();
		var i = n.map(function(n) {
			return !n.handler.fetchData || e.getActionContext().executeAction(n.handler.fetchData, {
				params: t.params,
				query: t.query
			})
		});
		return r.all(i).fail(function(e) {
			if ("undefined" == typeof window || !e.message.match(/Cannot read property \'removeChild\' of null/g)) throw e
		})
	};
module.exports = fetchData
