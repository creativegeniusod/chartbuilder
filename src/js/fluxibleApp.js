var Fluxible = require("fluxible");

var fluxibleApp = (require("fluxible-addons-react/provideContext"), new Fluxible({
	component: require("./components/Routes"),
	stores: [
		require("./stores/AppStore")
	]
}));

fluxibleApp.plug(require("./plugins/agent")());

module.exports = fluxibleApp;
