var React = require("react");
var PropTypes = React.PropTypes;
var clone = require("lodash/clone");

var ScaleReset = require("./ScaleReset.jsx");
var ScaleArrows = require("./ScaleArrows.jsx");

/* Chartbuilder UI components */
var chartbuilderUI = require("chartbuilder-ui");
var AlertGroup = chartbuilderUI.AlertGroup;
var LabelledTangle = chartbuilderUI.LabelledTangle;
var TextInput = chartbuilderUI.TextInput;

/**
 * Y scale settings for XY charts. Used in both XY and chart grid, and most
 * likely for future charts as well
 * @instance
 * @memberof editors
 */
var XY_yScaleSettings = React.createClass({

	propTypes: {
		className: PropTypes.string,
		id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
		name: PropTypes.string,
		onReset: PropTypes.func,
		onUpdate: PropTypes.func.isRequired,
		scale: PropTypes.object.isRequired,
		stepNumber: PropTypes.string,
		titleOverride: PropTypes.string,
		mobileOverride: PropTypes.bool,
		mobileOverrideFocus: PropTypes.func,
		errors: PropTypes.array,
		unevenTicksAlert: PropTypes.array,
		prefixSuffixAlert: PropTypes.array
	},
	
	getDefaultProps: function() {
		return {
			mobileOverride: false
		}
	},

	_handleScaleUpdate: function(k, v) {
		
		if(this.props.mobileOverride === true) {
			this.props.mobileOverrideFocus();
		}
		
		var scale = clone(this.props.scale, true);

		if(k != "precision") {
			scale[this.props.id].precision = 0;
		}

		scale[this.props.id][k] = v;
		this.props.onUpdate(scale);
	},

	_handleDomainUpdate: function(k, v) {
		
		if(this.props.mobileOverride === true) {
			this.props.mobileOverrideFocus();
		}
		
		var scale = clone(this.props.scale, true);
		scale[this.props.id].custom = true;
		if (k == "min") {
			scale[this.props.id].domain[0] = v;
		} else if (k == "max") {
			scale[this.props.id].domain[1] = v;
		}
		this.props.onUpdate(scale);
	},
	
	_renderUnevenTicksAlert: function() {
		
		if (!this.props.unevenTicksAlert) {
			return null;
		} else if (this.props.unevenTicksAlert.length === 0) {
			return null;
		} else {
			return (
				<div className="error-display">
					<AlertGroup alerts={this.props.unevenTicksAlert} />
				</div>
			);
		}
	},
	
	_renderPrefixSuffixAlert: function() {
		
		if (!this.props.prefixSuffixAlert) {
			return null;
		} else if (this.props.prefixSuffixAlert.length === 0) {
			return null;
		} else {
			return (
				<div className="error-display">
					<AlertGroup alerts={this.props.prefixSuffixAlert} />
				</div>
			);
		}
	},
	
	handleTangleClick: function(e) {
		if(e.target.tagName === "INPUT"){
			e.target.focus();
		}
	},

	_renderErrors: function() {

		if (!this.props.errors) {
			return null;
		} else if (this.props.errors.length === 0) {
			return null;
		} else {
			return (
				<div className="error-display">
					<AlertGroup alerts={this.props.errors} />
				</div>
			);
		}
	},

	render: function() {
		var currScale = this.props.scale[this.props.id];
		var errors = this._renderErrors();
		var prefixSuffixAlert = this._renderPrefixSuffixAlert();
		var unevenTicksAlert = this._renderUnevenTicksAlert();
		
		/*
		 * Figure out the amount by which to increment the tangle (drag) values: Eg
		 * <= 10 = 0.5
		 * < 100 = 1
		 * < 1000 = 10
		 * < 10000 = 100
		 * And so on
	  */
		var tangleStep;
		var range = Math.abs(currScale.domain[1] - currScale.domain[0]);
		if (range <= 10) {
			tangleStep = 0.5;
		} else {
			var numDigits = range.toString().length;
			tangleStep = Math.pow(10, (numDigits - 2));
		}
        
        var h = this;
        var f = function(e, t) {
			if (e) {
				var n = e.target,
					r = n.parentElement.previousSibling.getElementsByTagName("input")[0],
					i = n.classList.contains("uparrow") ? 38 : 40,
					a = new Event("keydown", {
						bubbles: !0,
						cancelable: !0
					});
				a.keyCode = i, a.which = i, a.altKey = !0, r.dispatchEvent(a);
				var o = t || this.boundTo,
					s = ["min", "max"].indexOf(this.boundTo) > -1 ? "_handleDomainUpdate" : "_handleScaleUpdate";
				h[s].bind(null, o, r.value)
			}
		};
		
		var tickSetting;
		var tickScaleArrow = null;
		var mobileFocus = this.props.mobileOverride === true ? this.props.mobileOverrideFocus : null;
		
		if (this.props.id === "primaryScale") {
			tickSetting = (
				<LabelledTangle
					label="Ticks"
					labelClass="editor-label"
					tangleClass="scale-option tangle-input"
					onChange={this._handleScaleUpdate.bind(null, "ticks")}
					onInput={this._handleScaleUpdate.bind(null, "ticks")}
					min={2}
					max={8}
					value={currScale.ticks}
				/>
			);
			tickScaleArrow = (
				<ScaleArrows
					clickHandler={f}
					boundTo="ticks"
				/>
			);
		}

		var title_block = (
			<h2 className="scale-option-title">
				<span className="step-number">{this.props.stepNumber}</span>
				{this.props.titleOverride ? this.props.titleOverride : "Configure axis"}
			</h2>
			);

		if (this.props.stepNumber === "") {
			title_block = (
				<h2 className="scale-option-title">
					{this.props.titleOverride ? this.props.titleOverride : "Configure the " + this.props.name + " axis"}
				</h2>
				);
		}

        var v = this.props.name.toLowerCase().indexOf("primary") === -1 ? "Right axis" : "Y-axis";
        var y = this.props.mobileOverride === true ? "" : v + " •";
        var b = this.props.mobileOverride === true ? y + "Set" : y + " set";
		
		return (
			<div className={this.props.className}>
				{title_block}
				<h4>{y +" label data"}</h4>
				<span className="helptext">
					Use the <strong> prefix </strong> and <strong> suffix </strong> {'to label the units of the axis. For example, in "$50 million", "$" is the'}
					<strong> prefix</strong>{' and "million" is the '} <strong>suffix</strong>.
				</span>
				<TextInput
					className="scale-option"
					onChange={this._handleScaleUpdate.bind(null, "prefix")}
					value={currScale.prefix}
					placeholder="Prefix, e.g. $"
					onFocus={mobileFocus}
				/>
				<TextInput
					id="suffix"
					className="scale-option"
					onChange={this._handleScaleUpdate.bind(null, "suffix")}
					value={currScale.suffix}
					placeholder="Suffix, e.g. million"
					onFocus={mobileFocus}
				/>
				
				<h4>{b +" values"}</h4>
				
				<ScaleReset
					scale={this.props.scale}
					scaleId={this.props.id}
					onUpdate={this.props.onReset}
					className="scale-reset"
					buttonText={"Reset values"}
				/>
				
				<span className="helptext">
					<strong> Minimum </strong> and <strong> Maximum </strong> {'set the lowest and highest values of your range;'}
					<strong> Ticks </strong>{'sets the number of values displayed on the axis;'} <strong>Decimal places </strong>
					determines how many decimal places these values will have.
				</span>
				
				<div className="scale-tangle-inputs" onClick={this.handleTangleClick}>
					<LabelledTangle
						label="Minimum"
						labelClass="editor-label"
						tangleClass="scale-option tangle-input"
						onChange={this._handleDomainUpdate.bind(null, "min")}
						step={tangleStep}
						onInput={this._handleDomainUpdate.bind(null, "min")}
						value={currScale.domain[0]}
					/>
					
					<ScaleArrows
						clickHandler={f}
						boundTo="min"
					/>
					
					<LabelledTangle
						label="Maximum"
						step={tangleStep}
						labelClass="editor-label"
						tangleClass="scale-option tangle-input"
						onChange={this._handleDomainUpdate.bind(null, "max")}
						onInput={this._handleDomainUpdate.bind(null, "max")}
						value={currScale.domain[1]}
					/>
					<ScaleArrows
						clickHandler={f}
						boundTo="max"
					/>
					
					{tickSetting}
					{tickScaleArrow}
					
					<LabelledTangle
						label="Precision"
						labelClass="editor-label"
						tangleClass="scale-option tangle-input"
						onChange={this._handleScaleUpdate.bind(null, "precision")}
						onInput={this._handleScaleUpdate.bind(null, "precision")}
						min={0}
						max={5}
						value={currScale.precision}
					/>
					
					<ScaleArrows
						clickHandler={f}
						boundTo="precision"
					/>		
					{errors}
				</div>
			</div>
		);
	}
});

module.exports = XY_yScaleSettings;
