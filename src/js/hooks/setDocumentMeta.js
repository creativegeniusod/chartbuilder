var r = require("q"),
	i = "undefined" != typeof window,
	setDocumentMeta = function(t, n, a, o, s) {
		var c, u, l, p, d, h, f;
		return i ? p = window.location.href : (c = s._parsedOriginalUrl, u = s.headers.host, l = null === c.protocol ? "http://" : "https://", p = l + u + n.pathname), h = function(e, t) {
			i ? a.replaceWith("not-found") : o.redirect("/404"), f = !0
		}, d = n.routes.map(function(e) {
			return !e.handler.documentMeta || e.handler.documentMeta(t.getComponentContext(), n, p, h)
		}), r.all(d).then(function(e) {
			return e.filter(function(e) {
				return e !== !0
			}).pop() || {}
		}).then(function(t) {
			if (i) {
				var n = require("../utils/structuredData");
				document.title = t.title || "Atlas";
				var r = null,
					a = null,
					o = {
						"og:image": "image",
						"twitter:image": "image",
						"og:description": "description",
						"twitter:description": "description",
						"twitter:title": "title",
						"og:title": "title",
						"og:url": "url",
						description: "description",
						keywords: "tag"
					};
				for (r in o) {
					var s, c;
					a = document.querySelector('meta[name="' + r + '"]'), null === a && (a = document.createElement("meta"), a.setAttribute("name", r), a.setAttribute("property", r), document.head.appendChild(a)), s = r.indexOf("image") > 1 ? window.atlasConfig.hostname + "/i/" + t[o[r]] : t[o[r]], r.indexOf("description") > -1 ? (s = "" === t[o[r]] || "undefined" == typeof t[o[r]] ? "The new home for charts and data, powered by Quartz." : t[o[r]] + " | Atlas - charts and data, powered by Quartz.", c = n.unmark(s), a.setAttribute("content", c)) : ("undefined" != typeof s && "undefined" !== s || (s = ""), a.setAttribute("content", s))
				}
				var u = document.getElementById("atlasStructuredData");
				t.description = n.unmark(c);
				var l = n.createJSON(t, p).__html;
				u.innerHTML = l
			}
			if (f) throw new Error("abort promise chain");
			return t
		})
	};
module.exports = setDocumentMeta;
