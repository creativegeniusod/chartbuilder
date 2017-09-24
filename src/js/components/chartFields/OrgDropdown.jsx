var React = require("react");
// Chartbuilder UI components
var chartbuilderUI = require("chartbuilder-ui");
var Dropdown = chartbuilderUI.Dropdown;
var PropTypes = React.PropTypes;

var OrgDropdown = React.createClass({

	propTypes: {
		options: PropTypes.array,
		onUpdate: PropTypes.func,
		onOrgChange: PropTypes.func,
		orgValue: PropTypes.string,
		dropdownDisabled: PropTypes.bool
	},
	
	onChange: function(e) {
		this.props.onOrgChange(e);
		this.props.onUpdate(this._reactInternalInstance._currentElement.key, e.target.value);
	},
	
	render: function() {
		var orgOptions = this.props.options.map(function(e, t) {
				return React.createElement("option", {
					value: e.value
				}, e.content)
			});
		
		var orgLabel = this.props.dropdownDisabled === true ? "Published" : "Publish";
		
		return (
			<div className="cb-text-input organization">
				<label className="focus">
					{orgLabel} "to"
				</label>
				<div className="cb-dropdown">
					<select className="cb-dropdown-select" 
						onChange={this.onChange} 
						defaultValue={this.props.orgValue}
						disabled={this.props.dropdownDisabled}>
						{orgOptions}
					</select>
				</div>
			</div>
		);
	}
});

module.exports = OrgDropdown;
