var Fluxible = require("fluxible");

var fluxibleApp = (require("fluxible-addons-react/provideContext"), new Fluxible({
	component: require("./components/Routes"),
	stores: [
		require("./stores/AppStore")
	]
}));
//fluxibleApp.plug(require("./plugins/agent")());

module.exports = fluxibleApp;


/*var Fluxible = require('fluxible');
var AppStore = require('./stores/AppStore');
var Routes = require('./components/Routes');

const fluxibleApp = new Fluxible({
    component: Routes,
    stores: [
        AppStore
    ]
});

fluxibleApp.plug(require("./plugins/agent")());

module.exports = fluxibleApp;*/

