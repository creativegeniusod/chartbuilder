// Component that handles global metadata, ie data that is universal regardless
// of chart type. Eg title, source, credit, size.

var React = require("react");
var PropTypes = React.PropTypes;
var PureRenderMixin = require("react-addons-pure-render-mixin");
var clone = require("lodash/clone");
var find = require("lodash/find");

// Flux stores
var ChartMetadataStore = require("../stores/ChartMetadataStore");
var ChartViewActions = require("../actions/ChartViewActions");

// Chartbuilder UI components
var chartbuilderUI = require("chartbuilder-ui");
var ButtonGroup = chartbuilderUI.ButtonGroup;
var TextInput = chartbuilderUI.TextInput;
var AlertGroup = chartbuilderUI.AlertGroup;

// Give chart sizes friendly names
var chart_sizes = [
	{
		title: "Auto",
		content: "Auto",
		value: "auto"
	},
	{
		title: "Medium",
		content: "Medium",
		value: "medium"
	},
	{
		title: "Long spot chart",
		content: "Long spot chart",
		value: "spotLong"
	},
	{
		title: "Small spot chart",
		content: "Small spot chart",
		value: "spotSmall"
	}
];

var text_input_values = [
	{ name: "title", content: "Title", isRequired: true },
	{ name: "source", content: "Source", isRequired: true }
];

/**
 * Edit a chart's metadata
 * @property {object} metadata - Current metadata
 * @property {string} stepNumber - Step in the editing process
 * @property {[components]} additionalComponents - Additional React components.
 * Anything passed here will be given a callback that updates the `metadata`
 * field. This is useful for adding custom input fields not provided.
 * @instance
 * @memberof editors
 */
var ChartMetadata = React.createClass({

	propTypes: {
		metadata: PropTypes.shape({
			chartType: PropTypes.string.isRequired,
			size: PropTypes.string.isRequired,
			source: PropTypes.string,
			credit: PropTypes.string,
			title: PropTypes.string
		}),
		stepNumber: PropTypes.string,
		additionalComponents: PropTypes.array,
		onAdditionalComponentUpdate: PropTypes.func
	},

	// Get text input types from state
	getInitialState: function() {
		return {
		};
	},

	// Update metadata store with new settings
	_handleMetadataUpdate: function(k, v) {
		ChartViewActions.updateMetadata(k, v);
		if(this.props.onAdditionalComponentUpdate){
			this.props.onAdditionalComponentUpdate(k, v)
		}
	},

	render: function() {
		var metadata = this.props.metadata;
        var metafield = [];
        var n = this;
        
		if (this.props.additionalComponents.length > 0) {
			this.props.additionalComponents.forEach(function(c, i) {
			    metafield.push(React.cloneElement(c, {
                    key: c.key,
                    onUpdate: n._handleMetadataUpdate,
                    value: metadata[c.key] || ""
                }))			
			});
		}
		// Create text input field for each metadata textInput
		var textInputs = text_input_values.map(function(textInput) {
		    var error = find(this.props.errors, { metadata: textInput.name });
			return <ChartMetadataText
				key={textInput.name}
				name={textInput.name}
				value={metadata[textInput.name]}
				placeholder={textInput.content}
				onChange={this._handleMetadataUpdate}
				isRequired={textInput.isRequired}
				isValid ={void 0 === error}
				alerts={void 0 !== error ? [error] : []}
			/>
		}, this);

		return (
			<div className="editor-options">
				<h2>
					<span className="step-number">{this.props.stepNumber}</span>
					<span>Set title, source, tags, and description</span>
				</h2>
				{textInputs}
				{metafield}

			</div>
		);
	}
});

// Small wrapper arount TextInput component specific to metadata
var ChartMetadataText = React.createClass({

	mixins: [ PureRenderMixin ],

	render: function() {
	    var warning_div = null;
        var text_length = "";
        if(this.props.name === "title"){
            text_length = parseInt(this.props.value.length, 10) >= 60 ? "character-count warn" : "character-count";
            warning_div = (
			    <div className={text_length}>
					{70 - parseInt(this.props.value.length, 10)}
			    </div>
            );
        }
        
		return (
			<div>
			    {warning_div}
			    
				<TextInput
					value={this.props.value}
					className="meta-option {this.props.name}"
					onChange={this.props.onChange.bind(null, this.props.name)}
					placeholder={this.props.placeholder}
					isRequired={this.props.isRequired}
					isValid={this.props.isValid}
				/>
				
				<div className="error-display">
					<AlertGroup
						alerts={this.props.alerts}
					/>
				</div>
			</div>
		);
	}
});

module.exports = ChartMetadata;
