var assign = require("lodash/assign"),
	omniture = {
		trackPageView: function(e) {
			var t = {};
			if (s) {
				var n = {
					pageName: document.title,
					server: "qz.com",
					channel: "atlas",
					prop3: document.title,
					pageType: "app",
					prop46: "atlas"
				};
				if ("undefined" != typeof window.innerHeight && self === top) {
					var i, a, o = 736,
						c = 1099;
					i = window.innerWidth <= o ? "mobile" : window.innerWidth > o && window.innerWidth <= c ? "tablet" : "desktop", a = window.innerHeight > window.innerWidth ? "portrait" : "landscape", t.prop26 = i + "|" + a
				}
				t = assign(t, n, e), s.t(t)
			}
		},
		trackEvent: function(e) {
			s.tl(!0, e.linkType, e.linkName)
		}
	};
module.exports = omniture
