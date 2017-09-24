var React = require("react");
var Link = require('react-router').Link;

var MainLayout = React.createClass({
  render: function() {
    return (
      <div className="app">
        <header className="primary-header"></header>
        <aside className="primary-aside">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/charts/new">Add Chart</Link></li>
          </ul>
        </aside>
        <main>
          {this.props.children}
        </main>
      </div>
    );
  }
});

module.exports = MainLayout;
