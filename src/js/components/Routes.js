var React = require("react");
var Router = require("react-router");
var Route = Router.Route;
var IndexRoute = Router.IndexRoute;
var Application = require('./Application');
var Home = require('./Home');
var About = require('./About');

var routes = (
    <Route name="app" path="/" component={Application}>
        <Route path="/" component={Home} />
        <Route name="about" path="about" component={About} />
        <IndexRoute name="home" component={Home} />
    </Route>
);

module.exports = routes;
