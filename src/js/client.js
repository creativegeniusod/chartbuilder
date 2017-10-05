'use strict';
var React = require('react');
var ReactDOM = require('react-dom');
var debug = require('debug');
var bootstrapDebug = debug('Example');
var app = require('./fluxibleApp');
var dehydratedState = window.App; // Sent from the server
var ReactRouter = require('react-router');
var FluxibleComponent = require('fluxible-addons-react/FluxibleComponent');
var createElement = require('fluxible-addons-react/createElementWithContext');
var q = require("q");

bootstrapDebug('rehydrating app');

window.React = React; // For chrome dev tool support
debug.enable('*');

function RenderApp(context){
    bootstrapDebug('React Rendering');
    var mountNode = document.getElementById('app');
    ReactDOM.render(
        React.createElement(
            FluxibleComponent,
            { context: context.getComponentContext() },
            React.createElement(ReactRouter.Router, {
                routes: context.getComponent(),
                history: ReactRouter.browserHistory
            })
        ),
        mountNode,
        function () {
            bootstrapDebug('React Rendered');
        }
    );
}

app.rehydrate(dehydratedState, function (err, context) {
    if (err) {
        throw err;
    }
    window.debug = debug;
    window.context = context;

    RenderApp(context);
});


/*function r(e, t) {
	return a.render(i.createElement(l, {
		context: e.getComponentContext()
	}, i.createElement(t, null)), document.getElementById("app")), s()
}
var i = require("react"),
	a = require("react-dom"),
	o = require("react-router"),
	s = require("q"),
	c = require("./fluxibleApp"),
	u = {},
	l = require("fluxible-addons-react/FluxibleComponent"),
	p = require("./actions/navigate").navigate,
	d = require("./hooks/fetchData"),
	h = require("./hooks/beforeFetch"),
	f = require("./hooks/afterFetch"),
	g = require("./hooks/setDocumentMeta"),
	m = require("./hooks/trackPageView");
window.React = i, c.rehydrate(u, function(e, t) {
	if (e) throw e;
	var n = !0,
		i = o.run(c.getComponent(), o.HistoryLocation, function(e, a) {
			return n ? (n = !1, r(t, e).then(function() {
				return m(t, a, !0)
			})) : void t.executeAction(p, a).then(function() {
				return h(t, a, i)
			}).then(function() {
				return d(t, a)
			}).then(function() {
				return f(t, a, i)
			}).then(function() {
				return g(t, a, i)
			}).then(function(n) {
				return r(t, e)
			}).then(function() {
				return m(t, a)
			})["catch"](function(e) {
				if ("abort promise chain" !== e.message) throw e
			})
		})
});*/
