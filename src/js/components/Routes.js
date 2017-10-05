var React = require("react");
var ReactRouter = require("react-router");
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var IndexRoute = ReactRouter.IndexRoute;

var Search = require("./Search");

var Application = require('./App');
//var Application = (Router.Redirect, require("./App"));

var Home = require('./Home');
var About = require('./About');
console.log(Home);

var routes = (
	<Route name="app" path="/" component={Application}>
		<Route name="about" path="about" component={About} />
		<IndexRoute name="home" component={Home} />
	</Route>
	
);

module.exports = routes;
