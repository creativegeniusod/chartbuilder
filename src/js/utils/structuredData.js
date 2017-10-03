var r = require("marked"),
	i = new r.Renderer;
i.link = function(e, t, n) {
	return n
}, i.paragraph = function(e) {
	return e
};
var structuredData = {
	unmark: function(e) {
		return r(e.replace(/[*_`]/gi, ""), {
			sanitize: !0,
			renderer: i
		})
	},
	createJSON: function(e, t) {
		var n, a, t;
		return n = {
			"@context": "http://schema.org",
			"@type": "WebPage",
			url: e.url,
			name: e.title,
			description: e.description ? r(e.description.replace(/[*_`]/gi, ""), {
				sanitize: !0,
				renderer: i
			}) : "",
			keywords: e.tag,
			sameAs: "http://twitter.com/atlascharts",
			thumbnailUrl: "http://www.theatlas.com/images/atlas_homescreen_192x192.png",
			publisher: {
				"@type": "Organization",
				name: "Quartz",
				logo: "http://app.qz.com/img/logo/quartz.svg",
				sameAs: ["http://en.wikipedia.org/wiki/Quartz_(publication)", "http://facebook.com/quartznews", "http://twitter.com/qz"],
				url: "http://qz.com",
				member: [{
					"@type": "Person",
					name: "Kevin J. Delaney",
					jobTitle: "CEO"
				}],
				memberOf: {
					"@type": "Corporation",
					name: "Atlantic Media"
				},
				location: {
					"@type": "PostalAddress",
					addressLocality: "New York",
					addressRegion: "NY"
				}
			},
			inLanguage: "en-us"
		}, e.published_time && e.image && (n.datePublished = e.published_time, n.relatedLink = t = "http://www.theatlas.com", n.thumbnailUrl = t + "/i/" + e.image, n.headline = e.title), n.description.indexOf("charts and data, powered by Quartz") === -1 && (n.description += " | Atlas - charts and data, powered by Quartz."), e.author && (a = {
			"@type": "Person",
			name: e.author
		}, n.author = a, n.creator = a), {
			__html: JSON.stringify(n)
		}
	}
};
module.exports = structuredData
