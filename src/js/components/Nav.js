var React = require('react');
var Router = require('react-router');
var Link = Router.Link;

var Nav = React.createClass({
	
    contextTypes: {
        router: React.PropTypes.object.isRequired,
    },
    
    render: function() {
        return (
            <ul className="pure-menu pure-menu-open pure-menu-horizontal">
                <li className={this.context.router.location.pathname === '/' ? 'pure-menu-selected' : ''}><Link to='/'>Home</Link></li>
                <li className={this.context.router.isActive('/about') ? 'pure-menu-selected' : ''}><Link to='/about'>About</Link></li>
            </ul>
        );
    }
});

module.exports = Nav;
