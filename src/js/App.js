var React = require("react");
var Router = require("react-router");
var Search = require("./components/Search");
var q = require("q");
var Link = Router.Link;
var AppStore = require("./stores/AppStore");
var AuthStore = require("./stores/AuthStore");
var FluxibleMixin = require("fluxible-addons-react/FluxibleMixin");
var Alert = require("chartbuilder-ui").Alert;

      
module.exports  = React.createClass({
	
	mixins: [Router.State, Router.Navigation, FluxibleMixin],
	
	statics: {
		storeListeners: [AppStore, AuthStore],
		tracking: function(e, t) {
			return e.getStore(AuthStore).isAuth() ? {
				prop2: "loggedin",
				user: e.getStore(l).user
			} : {}
		}
	},
	getInitialState: function() {
		return {
			app: this.getStore(AppStore).getState(),
			isAuth: this.getStore(AuthStore).isAuth()
		}
	},
	
	onChange: function() {
		this.setState({
			app: this.getStore(AppStore).getState(),
			isAuth: this.getStore(AuthStore).isAuth()
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
		var param = this.getParams();
		var	query = this.getQuery();
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
			</div>
		);	
	}
});
