var Agent  = require("./Agent");
module.exports = function(e) {
	return {
		name: "AgentPlugin",
		plugContext: function(e) {
			var t = e.headers,
				n = "undefined" == typeof window,
				i = n ? "localhost:3001" : "";
			return {
				plugActionContext: function(e) {
					e.agent = Agent.create(t, n, i)
					
					console.log(e.agent);
				},
				dehydrate: function() {
					return {
						headers: {
							"csrf-token": t["csrf-token"]
						}
					}
				},
				rehydrate: function(e) {
					t = e.headers
				}
			}
		}
	}
}
