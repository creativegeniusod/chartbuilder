var React = require('react');
var AppStore = require('../stores/AppStore');
var Router = require("react-router");
var FluxibleMixin = require("fluxible-addons-react/FluxibleMixin");
var ChartForm = require("./ChartForm.jsx");

module.exports  = React.createClass({
	
    displayName: "exports",
    
    contextTypes: {
        getStore: React.PropTypes.func,
        executeAction: React.PropTypes.func
    },
	
	mixins: [Router.State, Router.Navigation, FluxibleMixin],
	
	/*statics: {
		storeListeners: [AppStore]
	},*/
	
	getInitialState: function() {
		return {
			app: this.getStore(AppStore).getState()
		}
	},
    
    render: function() {
        return (
			<div id="chart-form" className="container">
				<ChartForm
				/>
			</div>
		);
    }
});
