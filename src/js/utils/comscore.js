var r = "2",
	i = "6463921",
	a = "undefined" != typeof window ? window.atlasConfig.hostname : 'localhost',
	comscore = {
		trackPageView: function(e) {
			"object" == typeof window && "object" == typeof window.COMSCORE && COMSCORE.beacon({
				c1: r,
				c2: i,
				c4: a + e
			})
		}
	};
module.exports = comscore
