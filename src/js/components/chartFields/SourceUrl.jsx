var React = require("react");
// Chartbuilder UI components
var chartbuilderUI = require("chartbuilder-ui");
var TextInput = chartbuilderUI.TextInput;
var PropTypes = React.PropTypes;

var SourceUrl = React.createClass({

	propTypes: {
		onUpdate: PropTypes.func,
		value: PropTypes.string
	},
	
	onChange: function(value) {
		this.props.onUpdate(this._reactInternalInstance._currentElement.key, value); 
	},
	
	render: function() {
		return (
			<TextInput
				placeholder="Source URL"
				onChange={this.onChange}
				value={this.props.value}
			/>
		);
	}
});

module.exports = SourceUrl;
