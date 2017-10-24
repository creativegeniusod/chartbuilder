var React = require("react");
var ReactRouter = require("react-router");
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var IndexRoute = ReactRouter.IndexRoute;
var browserHistory = ReactRouter.browserHistory;

var Search = require("./Search");

var Application = require('./App');
//var Application = (Router.Redirect, require("./App"));

var Home = require('./Home');
var About = require('./About');
console.log(Home);

var routes = (
    <Router history={browserHistory}>
		<Route name="app" path="/" component={Application}>
			<Route name="about" path="about" component={About} />
			<Route path="charts">
				<Route name="chart" path=":id" component={About} />
				<Route name="edit" path=":id/edit" component={About} />
			</Route>
			<IndexRoute name="home" component={Home} />
		</Route>
	</Router>
);

module.exports = routes;
