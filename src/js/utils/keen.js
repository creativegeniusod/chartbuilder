var r = (process.env.NODE_ENV || "development", require("lodash/assign"), require("js-cookie"));

KeenClient = require("keen-js");

var keen = {
	_hasBeenInitialized: !1,
	
	_initialize: function(e) {
		this._hasBeenInitialized = !0, this._keenClient = new KeenClient({
			projectId: e.projectId,
			writeKey: e.writeKey
		});
		var t = this._getKeenCookie();
		"undefined" == typeof t && (t = this._generateFreshCookieData(), this._setKeenCookie(t));
		var n = this._getSessionCookie();
		n ? this._setSessionCookie(n) : (n = this._generateFreshSessionCookieData(), this._setSessionCookie(n), this._incrimentPropertyInCookie("sessions"))
	},
	
	trackEvent: function(e) {
		var t = "undefined" != typeof window ? window.atlasConfig.keen : app.get("config").keen;
		this._hasBeenInitialized || this._initialize(t);
		var n = this._getBaseEventData(e);
		"undefined" != typeof e.keen && (e.keen.user ? n.user = this._getBaseUserData(e.keen.user) : e.user ? n.user = this._getBaseUserData(e.user) : n.user = this._getBaseUserData(), e.keen.causalEventType && (n.cause_event_type = e.keen.causalEventType), "undefined" != typeof e.keen.chart ? (n.chart = this._getChartData(e.keen.chart), n.chart.type = e.isEmbed ? "embed" : "big", "chart-share-tool" === e.keen.type ? this._keenClient.addEvent("view_embed_share_tools", n, function(e, t) {}) : this._keenClient.addEvent("view_chart", n, function(e, t) {})) : "page" === e.keen.type ? (n.page = {
			type: e.keen.subtype
		}, this._keenClient.addEvent("view_page", n, function(e, t) {})) : "archive" === e.keen.type && (n.archive = {
			type: e.keen.subtype,
			term: e.keen.term,
			length: e.keen.archive.pagination ? e.keen.archive.pagination.totalCount : 0
		}, this._keenClient.addEvent("view_archive", n, function(e, t) {})))
	},
	
	_getChartData: function(e) {
		var t = e.organization && e.organization.slug ? e.organization.slug : void 0,
			n = {
				id: e.id,
				atlas_url: "http://www.theatlas.com/charts/" + e.id,
				created_at: e.createdAt,
				updated_at: e.updatedAt,
				is_sponsored: e.isSponsored,
				aspect_ratio: e.aspectRatio,
				settings: {
					enable_data_download: e.dataDownloadable,
					enable_embed: e.embeddable,
					enable_image_download: e.imageDownloadable,
					appears_in_feeds_search: e.inFeeds
				},
				metadata: {
					chart_type: e.model.metadata.chartType,
					title: e.title,
					title_length: e.title.length,
					tags: e.tags,
					credit: e.model.metadata.credit,
					source: e.model.metadata.source,
					source_url: e.model.metadata.sourceUrl,
					size: e.model.metadata.size,
					description_length: this._getDescriptionLength(e.model.metadata.description)
				},
				chart_props: {
					num_series: e.model.chartProps.data.length,
					num_data_points: this._getNumberOfDataPoints(e.model.chartProps.data),
					has_secondary_axis: 1 === e.model.chartProps._numSecondaryAxis,
					colors: this._getChartColors(e.model.chartProps.chartSettings),
					num_colors: this._getChartColors(e.model.chartProps.chartSettings).length,
					types: this._getChartTypes(e.model.chartProps),
					num_types: this._getChartTypes(e.model.chartProps).length
				},
				author: this._getAtlasUserData(e.user)
			};
		return t && (n.organization = t), n
	},
	
	_getDescriptionLength: function(e) {
		return "undefined" == typeof e ? 0 : e.length
	},
	
	_getAtlasUserData: function(e) {
		var t, n;
		return e && e._id ? (t = e.organization && e.organization.slug ? [e.organization.slug] : void 0, n = {
			id: e._id,
			age_in_days: this._getAgeInDays(e.createdAt),
			created_at: e.createdAt,
			updated_at: e.updatedAt,
			prism_id: e.prismId,
			display_name: e.displayName,
			email: e.email,
			type: "staff"
		}, t && (n.organizations = t), n) : null
	},
	
	_getChartColors: function(e) {
		for (var t = e.length, n = [], r = 0; r < t; r++) n.indexOf(e[r].colorIndex) === -1 && n.push(e[r].colorIndex);
		return n
	},
	
	_getChartTypes: function(e) {
		var t = e.length,
			n = [];
		if (e._grid) n.push(e._grid.type);
		else
			for (var r = 0; r < t; r++) {
				var i = e.chartSettings[r];
				n.indexOf(i.type) === -1 && "string" == typeof i.type && n.push(i.type)
			}
		return n
	},
	
	_getNumberOfDataPoints: function(e) {
		for (var t = e.length, n = 0, r = 0; r < t; r++) n += e[r].values.length;
		return n
	},
	
	_getBaseEventData: function(e) {
		return {
			keen: {
				timestamp: (new Date).toISOString(),
				addons: [{
					name: "keen:ip_to_geo",
					input: {
						ip: "user.ip_address"
					},
					output: "user.geolocation"
				}, {
					name: "keen:ua_parser",
					input: {
						ua_string: "user.raw_user_agent"
					},
					output: "user.user_agent"
				}, {
					name: "keen:url_parser",
					input: {
						url: "raw_url"
					},
					output: "url"
				}, {
					name: "keen:referrer_parser",
					input: {
						referrer_url: "raw_referrer",
						page_url: "raw_url"
					},
					output: "referrer"
				}, {
					name: "keen:referrer_parser",
					input: {
						referrer_url: "raw_original_referrer",
						page_url: "raw_url"
					},
					output: "original_referrer"
				}]
			},
			raw_url: e.parent && e.parent.url ? e.parent.url : window.location.href,
			raw_referrer: e.parent && "string" == typeof e.parent.referrer ? e.parent.referrer : document.referrer,
			raw_original_referrer: e.parent && "string" == typeof e.parent.referrer ? e.parent.referrer : this._getRawOriginalReferrer(),
			glass: this._getGlass(e)
		}
	},
	
	_rawOriginalReferrer: !1,
	_getRawOriginalReferrer: function() {
		return this._rawOriginalReferrer === !1 && (this._rawOriginalReferrer = document.referrer), this._rawOriginalReferrer
	},
	
	_generateFreshCookieData: function() {
		return {
			id: this._generateUniqueId(),
			birth: Date.now(),
			sessions: {
				monthStamp: Date.now(),
				total: 0,
				months: [0, 0, 0]
			},
			events: {
				monthStamp: Date.now(),
				total: 0,
				months: [0, 0, 0]
			},
			logins: {
				monthStamp: Date.now(),
				total: 0,
				months: [0, 0, 0],
				first: !1
			}
		}
	},
	
	_generateFreshSessionCookieData: function() {
		return {
			id: this._generateUniqueId()
		}
	},
	
	_incrimentPropertyInCookie: function(e) {
		var t = this._getKeenCookie();
		"undefined" == typeof t && (t = this._generateFreshCookieData());
		var n = t[e];
		if ("undefined" != typeof n && "undefined" != typeof n.monthStamp && "undefined" != typeof n.months) {
			for (var r = this._getDifferenceInMonthIndex(n.monthStamp); r > 0;) n.months.unshift(0), n.months = n.months.slice(0, 3), 1 === r && (n.monthStamp = Date.now()), r--;
			n.months[0]++, n.total++, this._setKeenCookie(t)
		}
	},
	
	_getDifferenceInMonthIndex: function(e) {
		var t = new Date,
			e = new Date(e);
		return 12 * (t.getFullYear() - e.getFullYear()) + (t.getMonth() - e.getMonth())
	},
	
	_getKeenCookie: function() {
		return r.getJSON("atlas")
	},
	
	_getSessionCookie: function() {
		return r.getJSON("keen-session")
	},
	
	_setKeenCookie: function(e) {
		r.set("atlas", e, {
			expires: 365
		})
	},
	
	_setSessionCookie: function(e) {
		r.set("keen-session", e, {
			expires: .00139
		})
	},
	
	_getAgeInDays: function(e) {
		var t = "number" == typeof e ? e : Date.parse(e);
		return (Date.now() - t) / 864e5
	},
	
	_generateKeenTimestamp: function(e) {
		return new Date(e).toISOString()
	},
	
	_getBaseUserData: function(e) {
		var t = this._getKeenCookie(),
			n = this._getSessionCookie();
		"undefined" == typeof t && (t = this._generateFreshCookieData());
		var r, i;
		this._getAgeInDays(t.birth);
		return t.logins.first !== !1 && (r = {
			all_time: t.logins.total,
			by_month: t.logins.months,
			first: this._generateKeenTimestamp(t.logins.first)
		}), n && (i = n.id), {
			ip_address: "${keen.ip}",
			raw_user_agent: "${keen.user_agent}",
			cookie: {
				id: t.id,
				age_in_days: this._getAgeInDays(t.birth),
				events: {
					all_time: t.events.total,
					by_month: {
						this_month: t.events.months[0],
						first_previous_month: t.events.months[1],
						second_previous_month: t.events.months[2]
					}
				},
				sessions: {
					all_time: t.sessions.total,
					by_month: {
						this_month: t.sessions.months[0],
						first_previous_month: t.sessions.months[1],
						second_previous_month: t.sessions.months[2]
					}
				},
				logins: r,
				session_id: i
			},
			atlas: this._getAtlasUserData(e)
		}
	},
	
	_isEmbed: function() {
		return window.self !== window.top
	},
	
	_getGlass: function(e) {
		var t, n, r = 736,
			i = 1099,
			a = e.parent && e.parent.width ? e.parent.width : window.innerWidth,
			o = e.parent && e.parent.height ? e.parent.height : window.innerHeight;
		return t = a <= r ? "mobile" : a > r && a <= i ? "tablet" : "desktop", n = o > a ? "portrait" : "landscape", {
			width: a,
			height: o,
			type: t,
			orientation: n
		}
	},
	
	_generateUniqueId: function() {
		for (var e = function() {
				return Math.floor(65536 * (1 + Math.random())).toString(16).substring(1)
			}, t = "", n = 0; n < 8; n++) t += e();
		return t
	}
};
module.exports = keen;
