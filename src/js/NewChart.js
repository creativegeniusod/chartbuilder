var React = require("react");

module.exports = React.createClass({
	
	statics: {
		documentMeta: function(e, t, n) {
			return {
				title: "Atlas | Not Found",
				url: n
			}
		},
		tracking: function(e, t) {
			return {
				keen: {
					type: "page",
					subtype: "404"
				}
			}
		}
	},
	getInitialState: function() {
		return {
			message: this.props.message
		}
	},
	render: function() {
		return(
			<div className="not-found"></div>
		);
	}
});
