var superagent = require("superagent");
var q = require("q");
var each = require("lodash/each");
var method = ["get", "post", "del"];

var	s = function(e) {
		e.promise = function() {
			var defer = q.defer();
			return e.end(function(e, n) {
				e = e || n.error, e ? defer.reject(e) : defer.resolve(n)
			}), defer.promise
		}
	},
	c = function(e, t, n) {
		var r, i, a, o, s, c, u = atob(e),
			l = [];
		for (t = t || "", n = n || 512, r = 0; r < u.length; r += n) {
			for (i = u.slice(r, r + n), a = new Array(i.length), o = 0; o < i.length; o++) a[o] = i.charCodeAt(o);
			s = new Uint8Array(a), l.push(s)
		}
		return c = new Blob(l, {
			type: t
		})
	},
	
	Agent = function(e, t, n) {
		this._agent = t ? superagent.agent() : superagent, this._headers = e || {}, this._prefix = n || ""
	};

	Agent.create = function(e, t, n) {
		return new Agent(e, t, n)
	}, each(method, function(e) {
		Agent.prototype[e] = function(t) {
			return t = this._prefix + t, this._agent[e](t).set(this._headers).accept("json").use(s)
		}
	}), Agent.prototype.postImages = function(e, t, n) {
		var r, i, a, o, u, l, p, d = {
				png2x: "@2x",
				mobile: "_mobile"
			},
			h = this._agent.post(this._prefix + e).set(this._headers).accept("json");
		for (i in n)
			for (r in n[i]) a = "png2x" === r, u = "atlas" === i ? i + "_" : "", l = "undefined" != typeof d[r] ? d[r] : "", o = /^data:image\/png;base64,/, p = u + t + l + ".png", h.attach(u + r, c(n[i][r].replace(o, ""), "image/png"), p);
		return h.use(s)
	}, Agent.prototype.postUserPhoto = function(e, t) {
		var n = this._agent.post(this._prefix + e).set(this._headers).field("user", JSON.stringify(t.user));
		if (t.photo) {
			var r = /^data:image\/(gif|jpg|jpeg|png);base64,/,
				i = t.photo.replace(r, "");
			n.attach("photo", c(i), t.user._id)
		}
		return n.use(s)
	}, module.exports = Agent
