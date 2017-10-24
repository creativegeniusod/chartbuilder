var ReactRouter = require('react-router');
var browserHistory = ReactRouter.browserHistory;

function r(e, t) {
	var n = t.chartId;
	return e.dispatch("SEND_IMAGES_START"), e.agent.post("/api/charts/saveImages").send(t).promise().then(function(r) {
			var a, o;
			
			/*return e.dispatch("SEND_IMAGES", r.body),
				a = "chart", t.routerContext.history.pushState(a, {
					id: n
				});*/
			return e.dispatch("SEND_IMAGES", r.body), o = browserHistory.createPath("edit", {
				id: n
			}), r.body.chart.isDraft ? void(window.location.href = o) : (a = "charts", browserHistory.push('/charts/'+n));
		
		/*e.dispatch("SEND_IMAGES", r.body), e.agent.get("/api/auth/draftCount").promise().then(function(i) {
			var a, o;
			return e.dispatch("RECEIVE_USER_DRAFT_COUNT", i), o = t.routerContext.router.makePath("edit", {
				id: n
			}), r.body.chart.isDraft ? void(window.location.href = o) : (a = "chart", t.routerContext.router.transitionTo(a, {
				id: n
			}))
		})*/
		
	}, function(t) {
		e.dispatch("ERROR_SEND_IMAGES", t)
	})
}
var i = "test" === process.env.NODE_ENV ? e("../../config").hostname : "";

module.exports = {
	create: function(e, t) {
		return e.dispatch("CREATE_CHART_START"), e.agent.post("/api/charts").send({
			chart: t.chart
		}).promise().done(function(n) {
			e.dispatch("CREATE_CHART", n.body), e.executeAction(r, {
				chartId: n.body.chart._id,
				images: t.images,
				routerContext: t.routerContext
			})
		}, function(t) {
			e.dispatch("ERROR_CREATE_CHART", t)
		})
	},
	edit: function(e, t) {
		return e.dispatch("EDIT_CHART_START"), e.agent.post("/api/charts/" + t.chartId).send({
			chart: t.chart
		}).promise().done(function(n) {
			e.dispatch("EDIT_CHART", n.body), e.executeAction(r, {
				chartId: n.body.chart._id,
				images: t.images,
				routerContext: t.routerContext
			})
		}, function(t) {
			e.dispatch("ERROR_EDIT_CHART", t)
		})
	},
	getChart: function(e, t) {
		return e.dispatch("LOAD_CHART_START"), e.agent.get("/api/charts/" + t.params.id).promise().then(function(t) {
			e.dispatch("RECEIVE_CHART", t.body)
		}, function(t) {
			e.dispatch("ERROR_CHART", t)
		}).then(function(t) {
			e.agent.get("/api/auth/userPerms").promise().then(function(t) {
				e.dispatch("RECEIVE_USER_PERMISSIONS", t)
			})
		})
	},
	getRecent: function(e, t) {
		var n = t.url || i + "/api/charts/recent";
		return e.dispatch("LOAD_RECENT_START"), e.agent.get(n).promise().then(function(n) {
			t.url ? (e.dispatch("ADD_RECENT", n.body), e.dispatch("GET_MORE_ARCHIVE", {
				body: n.body,
				context: e,
				subtype: "recent"
			})) : e.dispatch("RECEIVE_RECENT", n.body)
		}, function(t) {
			e.dispatch("ERROR_RECENT", t)
		})
	},
	getPopular: function(e, t) {
		var n = t.url || "/api/charts/popular";
		return e.dispatch("LOAD_POPULAR_START"), e.agent.get(n).promise().then(function(n) {
			t.url ? (e.dispatch("ADD_POPULAR", n.body), e.dispatch("GET_MORE_ARCHIVE", {
				body: n.body,
				context: e,
				subtype: "popular"
			})) : e.dispatch("RECEIVE_POPULAR", n.body)
		}, function(t) {
			e.dispatch("ERROR_POPULAR", t)
		})
	},
	getChartsByTag: function(e, t) {
		var n = t.url || "/api/tag/" + t.params.tag;
		return e.dispatch("LOAD_TAG_START"), e.agent.get(n).promise().then(function(n) {
			t.url ? (e.dispatch("ADD_TAG", n.body), e.dispatch("GET_MORE_ARCHIVE", {
				body: n.body,
				context: e,
				subtyle: "tag"
			})) : e.dispatch("RECEIVE_TAG", n.body)
		}, function(t) {
			e.dispatch("ERROR_TAG", t)
		})
	},
	getChartsByUser: function(e, t) {
		var n = t.url || "/api/user/" + t.params.id;
		return e.dispatch("LOAD_USER_ARCHIVE_START"), e.agent.get(n).promise().then(function(n) {
			t.url ? (e.dispatch("ADD_USER_ARCHIVE", n.body), e.dispatch("GET_MORE_ARCHIVE", {
				body: n.body,
				context: e,
				subtype: "user"
			})) : e.dispatch("RECEIVE_USER_ARCHIVE", n.body)
		}, function(t) {
			e.dispatch("ERROR_USER_ARCHIVE", t)
		})
	},
	getDraftsByUser: function(e, t, n) {
		var r = t.url || "/api/user/" + t.params.id + "/drafts";
		return e.dispatch("LOAD_USER_ARCHIVE_START"), e.agent.get(r).promise().then(function(r) {
			t.url ? (e.dispatch("ADD_USER_ARCHIVE", r.body), e.dispatch("GET_MORE_ARCHIVE", {
				body: r.body,
				context: e,
				subtype: "user"
			})) : e.dispatch("RECEIVE_USER_ARCHIVE", r.body), n()
		}, function(t) {
			e.dispatch("ERROR_USER_ARCHIVE", t)
		})
	},
	getChartsByOrganization: function(e, t) {
		var n = t.url || "/api/organization/" + t.params.id;
		return e.dispatch("LOAD_ORGANIZATION_ARCHIVE_START"), e.agent.get(n).promise().then(function(n) {
			t.url ? (e.dispatch("ADD_ORGANIZATION_ARCHIVE", n.body), e.dispatch("GET_MORE_ARCHIVE", {
				body: n.body,
				context: e,
				subtype: "organization"
			})) : e.dispatch("RECEIVE_ORGANIZATION_ARCHIVE", n.body)
		}, function(t) {
			e.dispatch("ERROR_ORGANIZATION_ARCHIVE", t)
		})
	},
	getChartsBySponsor: function(e, t) {
		var n = t.url || "/api/sponsor/" + t.params.username;
		return e.dispatch("LOAD_SPONSOR_ARCHIVE_START"), e.agent.get(n).promise().then(function(n) {
			t.url ? (e.dispatch("ADD_SPONSOR_ARCHIVE", n.body), e.dispatch("GET_MORE_ARCHIVE", {
				body: n.body,
				context: e,
				subtype: "sponsor"
			})) : e.dispatch("RECEIVE_SPONSOR_ARCHIVE", n.body)
		})["catch"](function(t) {
			e.dispatch("ERROR_SPONSOR_ARCHIVE", t)
		})
	},
	downloadImage: function(e, t) {
		e.dispatch("DOWNLOAD_IMAGE", t)
	},
	downloadData: function(e, t) {
		e.dispatch("DOWNLOAD_DATA", t)
	},
	deleteChart: function(e, t) {
		var n = "/api/charts/" + t.chartId;
		return e.dispatch("DELETE_CHART", t), e.agent.del(n).promise().then(function(n) {
			t.isDraft && t.draftContext && window ? e.agent.get("/api/auth/draftCount").promise().then(function(n) {
				switch (e.dispatch("RECEIVE_USER_DRAFT_COUNT", n), t.draftContext) {
					case "grid":
						return document.location.reload();
					case "chartPage":
						return t.routerContext.router.transitionTo("userDrafts", {
							id: t.user.username
						});
					default:
						return t.routerContext.router.transitionTo("index")
				}
			}) : t.routerContext.router.transitionTo("index")
		}, function(n) {
			e.dispatch("CHART_NOT_DELETED", {
				errorObj: n,
				chart: t.chartId
			})
		})
	},
	listSponsors: function(e, t) {
		e.dispatch("LIST_SPONSORS_START", t);
		var n = "/api/charts/listSponsors";
		return e.agent.get(n).promise().then(function(t) {
			e.dispatch("RECEIVE_SPONSORS", t.body)
		}, function(t) {
			e.dispatch("ERROR_LIST_SPONSORS", t)
		})
	}
}
