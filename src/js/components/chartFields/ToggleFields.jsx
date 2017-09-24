var React = require("react");
// Chartbuilder UI components
var chartbuilderUI = require("chartbuilder-ui");
var Toggle = chartbuilderUI.Toggle;
var PropTypes = React.PropTypes;

var ToggleFields = React.createClass({

	propTypes: {
		onUpdate: PropTypes.func,
		fields: PropTypes.arrayOf(PropTypes.shape({
			name: PropTypes.string,
			label: PropTypes.string,
			value: PropTypes.bool
		})).isRequired
	},
	
	onChange: function(e, t) {
		var n = {};
        Object.keys(this.refs).forEach(function(e, t) {
            n[e] = this.refs[e].state.toggled
        }, this), this.setState(n), this.props.onUpdate && (this.props.onUpdate(n), this.props.fields.map(function(e, t) {
			var n = this.refs[e.name].state.toggled ? "on" : "off";
			e.label = e.label.replace(/on|off/gi, n)
		}, this));
	},
	
	render: function() {
		var toggleFields = this.props.fields.map(function(e, t) {
			return React.createElement(Toggle, {
				name: e.name,
				onToggle: this.onChange,
				toggled: e.value,
				label: e.label,
				ref: e.name,
				key: e.name
			})
		}, this);
		
		return (
			<div className="atlas-toggle-group">
				{toggleFields}
			</div>
		);
	}
});

module.exports = ToggleFields;
