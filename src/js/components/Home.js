var React = require('react');
var AppStore = require('../stores/AppStore');
var Router = require("react-router");
//var FluxibleMixin = require("fluxible-addons-react/FluxibleMixin");
var ChartForm = require("./ChartForm.jsx");
var Serach = require("./Search");

module.exports  = React.createClass({
	
    displayName: "exports",
    
    /*contextTypes: {
        getStore: React.PropTypes.func,
        executeAction: React.PropTypes.func
    },
	
	mixins: [Router.State, Router.Navigation, FluxibleMixin],
	
	statics: {
		storeListeners: [AppStore]
	},
	
	getInitialState: function() {
		return {
			app: this.getStore(AppStore).getState()
		}
	},*/
    
    render: function() {
        return (
			<div id="index">
				<div className="hero">
					<div className="home-hero-text">
						<div className="logo"></div>
						<div className="tagline">
							{"The new home for charts and data, powered by "}<a href='//qz.com'>Quartz</a>
						</div>
						<div className="search-container">
							<Serach
								position="index"
							/>
						</div>
					</div>
				</div>
			</div>
		);
    }
});
