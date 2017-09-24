var React = require("react");
var ReactDom = require("react-dom");
var chartbuilderUI = require("chartbuilder-ui");
var TextArea = chartbuilderUI.TextArea;
var PropTypes = React.PropTypes;

var Description = React.createClass({

	propTypes: {
		onUpdate: PropTypes.func,
		value: PropTypes.string
	},
	
	onChange: function(value) {
		this.props.onUpdate(this._reactInternalInstance._currentElement.key, value); 
		this.setState({currentValue: value});
		if(value !== ""){
			this.setState({isFocused: true});
		}
	},
	
	componentDidMount: function() {
		if(this.props.value && this.props.value !== ""){
			this.setState({ isFocused: true})
		}
	},
	
	getInitialState: function() {
		return { 
			isFocused: false, 
			currentValue: this.props.value || ""
	    }
	},
	
	handleFocus: function() {
		this.setState({
			isFocused: true
		})
	},
	
	handleBlur: function() {
		if(this.state.currentValue === ""){
			isFocused: false
	    }
	},

	render: function() {
		var isFocused = this.state.isFocused ? "focused" : "";
		var	textAreaClass = "description-area " + isFocused;
		
		return (
			<div className={textAreaClass}>
			    <label className="cb-text-label">
					"Description (supports Markdown)"
			    </label>
			    <TextArea
					ref="textarea"
					className="chart-form-description"
					placeholder=""
					onChange={this.onChange}
					onFocus={this.handleFocus}
					onBlur={this.handleBlur}
					value={this.props.value}
			    />
			</div>
		);
	}
});

module.exports = Description;
