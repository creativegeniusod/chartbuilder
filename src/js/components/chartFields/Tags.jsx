var React = require("react");
var isArray = require("lodash/isArray");
var chartbuilderUI = require("chartbuilder-ui");
var TextInput = chartbuilderUI.TextInput;
var AlertGroup = chartbuilderUI.AlertGroup;
var PropTypes = React.PropTypes;

var Tags = React.createClass({

	propTypes: {
		onUpdate: PropTypes.func,
		value: PropTypes.oneOfType([PropTypes.string, PropTypes.array])
	},
	
	onChange: function(value) {
		this.props.onUpdate(this._reactInternalInstance._currentElement.key, value); 
		this.setState({showErrors: true});
	},
	
	componentDidMount: function() {
		var e = this;
		document.querySelector(".save-button").addEventListener("click", function(t) {
			e.setState({
				showErrors: true
			})
		});
	},
	
	getInitialState: function() {
		return { 
			showErrors: false
	    }
	},
	
	render: function() {
		
		var tagValues = isArray(this.props.value) ? this.props.value.join(", ") : this.props.value;
        var isValid = true;
        var errorMessage = [];
        
        if(this.state.showErrors === true){
			if(tagValues.length > 0) {
				isValid = true;
			}
			else{
				errorMessage.push({
                    text: "At least one tag is required.",
                    type: "error"
                })
                isValid = false;
			}
		}                
		
		return (
			<div className="input-tags">
			    <TextInput
					placeholder="Tags (comma-separated list)"
					onChange={this.onChange}
					value={this.props.value}
					isRequired={true}
					value={tagValues}
					isValid={isValid}
			    />
			    
			    <div className="error-display">
					<AlertGroup
						alerts={errorMessage}
					/>
			    </div>
			</div>
		);
	}
});

module.exports = Tags;
