var React = require('react');
var AppStore = require('../stores/AppStore');
var Nav = require('./Nav');
var provideContext = require('fluxible-addons-react/provideContext');
var connectToStores = require('fluxible-addons-react/connectToStores');
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;
var routes = require('./Routes');
var createBrowserHistory = require('history/lib/createBrowserHistory');
var FluxibleMixin = require("fluxible-addons-react/FluxibleMixin");

var Application = React.createClass({

    contextTypes: {
        getStore: React.PropTypes.func,
        executeAction: React.PropTypes.func,
        router: React.PropTypes.func
    },
    
    mixins: [Router.State, Router.Navigation, FluxibleMixin],
	
	statics: {
		storeListeners: [AppStore]
	},
	
	getInitialState: function() {
		return {
			app: this.getStore(AppStore).getState()
		}
	},
	
	onChange: function() {
		this.setState({
			app: this.getStore(AppStore).getState()
		})
	},
    
    render: function() {
        return (
            <div>
                <Nav />
                {this.props.children}
            </div>
        );
    }
});

module.exports = Application;
