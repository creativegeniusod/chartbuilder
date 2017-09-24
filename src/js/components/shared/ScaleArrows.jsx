var React = require("react");
var PropTypes = React.PropTypes;

var ScaleArrows = React.createClass({

	propTypes: {
		clickHandler: PropTypes.func,
		boundTo: PropTypes.string
	},

	_triggerclickHandler: function(e) {
		this.props.clickHandler && this.props.clickHandler(e, this.props.boundTo)
	},

	render: function() {
		return (
		    <div>
				<div className="uparrow" onClick={this._triggerclickHandler}>
					{"▲"}
				</div>
				<div className="downarrow" onClick={this._triggerclickHandler}>
					{"▼"}
				</div>
		    </div>
		);
	}

});

module.exports = ScaleArrows;
