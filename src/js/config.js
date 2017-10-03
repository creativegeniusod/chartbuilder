var config = {
	development: {},
	staging: {},
	production: {
		env: "production",
		serverName: "apps01.qzprod.amc",
		hostname: "https://www.theatlas.com",
		db: "mongodb://mongo01.qzprod.amc/atlas,mongodb://mongo02.qzprod.amc/atlas",
		adminEmail: "no-reply@theatlas.com",
		cookieDomain: ".theatlas.com",
		chartbeat: {
			key: "b9886d09e043f84697a08c7828f3ee05"
		},
		ads: {
			enabled: !0,
			dfpId: 56091333,
			embeds: !0
		},
		redis: {
			host: "proxy.qzprod.amc",
			port: 6379
		},
		keen: {
			projectId: "55a69f8d6f31a241a52fde8a",
			writeKey: "08dcfbac8f31d686e1669f70f19f7d704d3145e0d890bc220153a0d24e78af875d095f5b82a1faae73ffd4474d3685cc31b722d1632176aa4e23ba8d9daf91e99315828e48a2dcecbcf56bed42e786c7bdc5ce88acbdba8414ffceaf4e7b95de792a14821764a1cdcddc8a1a9d521ede"
		},
		facebook: {
			clientID: 0x5410387313519,
			clientSecret: "0fce16bf9db431e46e1cd4d65e4784c7",
			callbackURL: "https://www.theatlas.com/api/auth/facebook/callback",
			profileFields: ["id", "first_name", "last_name", "link", "gender", "locale", "timezone", "updated_time", "picture.type(large)", "email"]
		},
		pingbacks: {
			serverUrl: "https://pingbacks.theatlas.com:9000/ping",
			baseUrl: "https://pingbacks.theatlas.com:9000/charts/"
		},
		showCBInGrid: !1,
		instart: {
			username: "api@qz.com",
			pw: "Y52*hmCN",
			purgeURL: "https://api.instartlogic.com/atlanticmedia/v1/cache/purge"
		},
		embeds: {
			styles: {
				external: {
					"default": "border=thin&padding=20px&background-color=white"
				},
				internal: {
					index: "border=none&padding=1rem&background-color=quartz-gray&title=none"
				}
			}
		},
		admin: {
			postUrl: "//atlas-admin.qzprod.amc/hasAdminAccess",
			logoutUrl: "//atlas-admin.qzprod.amc/logout"
		}
	}
};
module.exports = config;
