var React = require("react");
var Router = require("react-router");
var Search = require("./Search");
var q = require("q");
var Link = Router.Link;
var AppStore = require("../stores/AppStore");
var FluxibleMixin = require("fluxible-addons-react/FluxibleMixin");
var Alert = require("chartbuilder-ui").Alert;

      
module.exports  = React.createClass({
	displayName: "exports",
	
	contextTypes: {
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
	},
	
	onChange: function() {
		this.setState({
			app: this.getStore(AppStore).getState()
		})
	},
	
	getErrorBar: function() {
		return this.state.app.appError && null !== this.state.app.appError ? React.createElement(Alert, {
			alertType: "default",
			alertText: this.state.app.appError,
			ref: "errorBar",
			onClick: this.hideErrorBar
		}) : null
	},
	
	hideErrorBar: function(e) {
		this.refs.errorBar.classList.add("hidden"), ReactDOM.unmountComponentAtNode(this.refs.errorBar, this.getDOMNode())
	},
	
	navSearchClicked: function(e) {
		this.transitionTo("search")
	},
	
	getLoginState: function() {
		return this.state.isAuth
	},
	
	getAppSections: function() {
		var e = ["popular", "most recent", "technology", "finance", "economics", "corporate"];
		return e
	},
	
	mobileTopNavClasses: function() {
		var e = "topnav-touch ",
			t = "index",
			n = this.state.app.route.routes,
			r = n.slice(-1)[0].name === t && 2 === n.length;
		return e += r ? "" : "hidden"
	},
	
	render: function() {
		var param =  this.props.params;
		var	query = this.props.location.search;
		var loginClass = this.getLoginState() === !0 ? " logged-in" : "";
		
		return(
			<div>
				{this.getErrorBar()}
				<nav className={"navbar " + loginClass}>
					<div className="search-container">
						<Link to="/search">
							<i className="icon icon-search"></i>
							<span>Search</span>
						</Link>
					</div>
					<div className="logo">
						<Link to="index" title="atlas">
							<div className="image"></div>
						</Link>
					</div>						
				</nav>
				<Search
					message={param.message}
					query={query}
					params={param}
				/>
				{this.props.children}
			</div>
		);	
	}
});
