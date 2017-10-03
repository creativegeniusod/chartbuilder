/*
 * ### Chartbuilder.jsx
 * Parent Chartbuilder component. Queries stores for state on update and sends
 * updates to children
*/

/* Node modules */
var React = require("react");
var update = require("react-addons-update");
var PropTypes = React.PropTypes;

/* Flux stores */
var ChartPropertiesStore = require("../stores/ChartPropertiesStore");
var ChartMetadataStore = require("../stores/ChartMetadataStore");
var SessionStore = require("../stores/SessionStore");
var ErrorStore = require("../stores/ErrorStore");

/*
 * Global React components that are used irrespective of chart type
 * More info within each component's definition.
*/
var Canvas = require("./Canvas.jsx");
var ChartExport = require("./ChartExport.jsx");
var ChartMetadata = require("./ChartMetadata.jsx");
var ChartTypeSelector = require("./ChartTypeSelector.jsx");
var RendererWrapper = require("./RendererWrapper.jsx");
var LocalStorageTimer = require("./LocalStorageTimer.jsx");
var SaveButton = require("../__qz/SaveButton.jsx");

var AlertGroup = require("chartbuilder-ui").AlertGroup;

var svgWrapperClassName = {
	desktop: "renderer-svg-desktop",
	mobile: "renderer-svg-mobile"
};

// Associates a given chart type with its Editor and Renderer components.
var chartEditors = require("../charts/editors");
var numColors = require("../config/chart-style").numColors;

/* API to localStorage that allows saving and retrieving charts */
var ChartbuilderLocalStorageAPI = require("../util/ChartbuilderLocalStorageAPI");
var some = require("lodash/some");

/**
 * Function to query Flux stores for all data. Runs whenever the stores are
 * updated, usually by the Editor but occassionally by Renderers that allow
 * direct editing of the chart, eg draggable legend labels in `XYRenderer.jsx`
 * @name Chartbuilder#getStateFromStores
 * @returns {Object} Chartbuilder state
*/
function getStateFromStores() {
	return {
		chartProps: ChartPropertiesStore.getAll(),
		metadata: ChartMetadataStore.getAll(),
		errors: ErrorStore.getAll(),
		session: SessionStore.getAll()
	};
}

/**
 * ### Chartbuilder parent component
 * @name Chartbuilder
 * @class
 * @property {boolean} autosave - Save to localStorage after every change
 * @property {boolean} showMobilePreview - Show mobile preview underneath default chart
 * @property {function} onStateChange - Callback when state is changed
 * @property {Object} additionalComponents - Optional additional React components
 * @property {string} renderedSVGClassName - Optional class name for chart SVG class
 * @example
 * var React = require("react");
 * var Chartbuilder = require("./components/Chartbuilder.jsx");
 * var container = document.querySelector(".chartbuilder-container");
 *
 * React.render(
 *   <Chartbuilder
 *     autosave={true}
 *     showMobilePreview={true}
 *   />,
 * container );
*/
var Chartbuilder = React.createClass({

	propTypes: {
		autosave: PropTypes.bool,
		showSaveButton: PropTypes.bool,
		showMobilePreview: PropTypes.bool,
		onSave: PropTypes.func,
		onStateChange: PropTypes.func,
		validateMeta: PropTypes.func,
		additionalComponents: PropTypes.shape({
			metadata: PropTypes.array,
			misc: PropTypes.object
		}),
		renderedSVGClassName: PropTypes.string,
		isPublishedChart: PropTypes.bool
	},

	getInitialState: function() {
		//return getStateFromStores();
		this.firstState = getStateFromStores(); 
		this.initialState = Object.assign({}, this.firstState);
		if(window){
			window.initialMobileChartState = Object.freeze(this.initialState.chartProps.mobile);
		}
		return this.firstState;
	},

	getDefaultProps: function() {
		return {
			autosave: true,
			additionalComponents: {
				metadata: [],
				misc: {}
			}
		};
	},

    componentWillMount: function() {
        this.setState({
            shouldShowErrors: false
        })
    },

	/* Add listeners to update component state when stores update */
	componentDidMount: function() {
		ChartPropertiesStore.addChangeListener(this._onChange);
		ChartMetadataStore.addChangeListener(this._onChange);
		ErrorStore.addChangeListener(this._onChange);
		SessionStore.addChangeListener(this._onChange);
	},

	/* Remove listeners on component unmount */
	componentWillUnmount: function() {
		ChartPropertiesStore.removeChangeListener(this._onChange);
		ChartMetadataStore.removeChangeListener(this._onChange);
		ErrorStore.removeChangeListener(this._onChange);
		SessionStore.removeChangeListener(this._onChange);
	},

	_getAlerts: function() {
        var error = [];
        return this.state.shouldShowErrors === false ? error : (this.props.validateMeta && (error = this.props.validateMeta(this.state.metadata, this.isSavingDraft)), this.state.errors.messages.concat(error));
    },
	
	_getEditorAlerts: function() {
		var errors = {
			messages: []
		};
		if (this.props.validateData && this.state.shouldShowErrors === true) {
			var data = this.props.validateData(this.state);
			if(data && this.state.errors){
				errors.valid = false; 
				errors.messages = []; 
				errors.messages.push(data);
		    }
		}
		errors.messages = this.state.errors.messages.concat(errors.messages);
		if(this.props.additionalComponents){
			errors.messages = this._formatForAtlas(errors.messages);
		}
		
		return errors;
	},
	
	_renderErrors: function() {
		if (this.state.shouldShowErrors !== false) {
			var error_messages = this._getAlerts();
			var isInvalid = some(error_messages, { type: "error"});
			var isWarning = some(error_messages, { type: "warning"});
			var messages = [];
			
			if(isInvalid){
                messages.push({
				    text: "Please review the changes above to continue",
				     type: "error"
			    });
			}
			
			if(isWarning){
                messages.push({
				    text: "Please consider reviewing the changes above",
				    type: "warning"
			    });
			}
			
			return (
				<div>
					<AlertGroup
						alerts={messages}
					/>
				</div>
			);
		}
	},
	
	_renderChartDetailPreview: function() {
		var cp;
		if (cp = this.props.additionalComponents.chartDetailPreview, !cp) return null;
		var e, t = this.state.metadata.tags;
		return e = t.length > 0 && "object" == typeof t ? t.join(", ") : t, React.cloneElement(cp, {
			chart: {
				id: "",
				user: cp.props.chart.user,
				model: {
					metadata: this.state.metadata
				},
				description: this.state.metadata.description,
				tags: e
			},
			isPreview: true
		})
    },
	
	_doSave: function(e, t) {
		this.setState({ shouldShowErrors: true }); 
		this.isSavingDraft = t;
		
		var error_message = (this._getAlerts(t), this._getEditorAlerts(), this.state.errors.messages.filter(function(e) {
			return "error" === e.type
		}));
		
		if(error_message.length === 0){
			e.isDraft = t;
			this.props.onSave(e);
	    }else{
			this.setState({
			    savingDraft: false,
			    publishingChart: false
		    });
		}
	},
	
	_renderSaveButton: function() {
		var error_message = this._getAlerts(null, true);
		var isInvalid = some(error_message, { type: "error" });
		var saveButton;
		
		saveButton = ( <SaveButton
			onSave={this._doSave}
			model={this.state}
			generateMobileImage={this.props.showMobilePreview}
			desktopClass="renderer-svg-desktop"
			mobileClass="renderer-svg-mobile"
			disabled={isInvalid}
			active={!isInvalid}
			isDraft={false}
			isPublishedChart={this.props.isPublishedChart}
		/> );
		
		return saveButton;
	},
	
	_renderSaveDraftButton: function() {
		var error_message = this._getAlerts(null, true);
		var isInvalid = some(error_message, { type: "error"});
		var isEqual = require("lodash/isEqual");
		var	status = true;
		var saveDraftButton;
		
		if(isEqual(this.state.chartProps, this.initialState.chartProps) && isEqual(this.state.metadata, this.initialState.metadata)){
			status = false;
		}
		if(window && window.initialMobileChartState && (isEqual(this.state.chartProps.mobile, window.initialMobileChartState) || (status = true))){
			if(window){
				window.atlasFormDataChanged = status;
		    }
		}
		
		return isEqual(this.state.chartProps, this.initialState.chartProps) && isEqual(this.state.metadata, this.initialState.metadata) && (status = false), window && window.initialMobileChartState && (isEqual(this.state.chartProps.mobile, window.initialMobileChartState) || (status = true)), window && (window.atlasFormDataChanged = status), React.createElement(SaveButton, {
			onSave: this._doSave,
			model: this.state,
			generateMobileImage: this.props.showMobilePreview,
			desktopClass: "renderer-svg-desktop",
			mobileClass: "renderer-svg-mobile",
			disabled: isInvalid || !status,
			active: !isInvalid && status,
			isDraft: true,
			onDraftSave: this._handleDraftClick,
			isPublishedChart: this.props.isPublishedChart
		});
		/*saveDraftButton = (<SaveButton
			onSave={this._doSave}
			model={this.state}
			generateMobileImage={this.props.showMobilePreview}
			desktopClass="renderer-svg-desktop"
			mobileClass="renderer-svg-mobile"
			disabled={isInvalid || !status}
			active={!isInvalid && status}
			isDraft={true}
			onDraftSave={this._handleDraftClick}
			isPublishedChart={this.props.isPublishedChart}
		/> );
		
		return saveDraftButton;*/
	},
	
	_handleDraftClick: function() {
		"" === this.state.metadata.title && (this.state.metadata.title = "Untitled"), this.setState({
			savingDraft: true
		})
	},
	
	_formatForAtlas: function(e) {
		return e.length && e.length > 0 && e.forEach(function(e) {
			var t = e.text.toLowerCase(),
				n = e.text;
			t.indexOf("chartbuilder") !== -1 && (n = n.replace("by Chartbuilder", ""), n = n.replace("than Chartbuilder supports", "than is supported"), e.text = n)
		}), e
	},
	
	_onAdditionalComponentUpdate: function(e, t) {
		if(e === "organization" && this.props.onAdditionalComponentUpdate){
			this.setState(this.props.onAdditionalComponentUpdate(e, t));
		}
	},
                
	_getNumColors: function() {
		return this.state.numColors ? this.state.numColors : this.props.numColors ? this.props.numColors : numColors
	},
  
	/*_renderErrors: function() {
		if (this.state.errors.messages.length === 0) {
			return null;
		} else {
			return (
				<div>
					<h2>Have a look at these issues:</h2>
					<AlertGroup
						alerts={this.state.errors.messages}
					/>
				</div>
			);
		}
	},*/

	/*
	 * Identify the chart type used and render its Editor. The corresponding
	 * Renderer is rendered within `RendererWrapper`, in case a Chartbuilder chart
	 * is being used as a module or without the editor.
	*/
	render: function() {
		var chartType = this.state.metadata.chartType;
		var Editor = chartEditors[chartType].Editor;
        var draftSave = this.state.savingDraft === true ? "draft-save" : "";
        var chartPublish = this.state.publishingChart === true ? "chart-publish" : "";
        var numSteps = Editor.defaultProps.numSteps + 1;
                        
		// Check for mobile override settings and pass them in
		var MobileComponent = chartEditors[chartType].MobileOverrides;
		var mobileOverrides;
		if (MobileComponent && this.props.showMobilePreview) {
			mobileOverrides = (
				<MobileComponent
					chartProps={this.state.chartProps}
					errors={this.state.errors}
					stepNumber={numSteps + 1}
				/>
			);
		} else {
			mobileOverrides = null;
		}

		var editorSteps = Editor.defaultProps.numSteps + (this.state.chartProps.hasDate || this.state.chartProps.isNumeric ? 1 : 0);
		var mobilePreview;

		// Mobile preview of the chart, if told to render
		if (this.props.showMobilePreview) {
			mobilePreview = (
				<div className="mobile">
					<div className="phone-wrap">
						<div className="phone-frame">
							<RendererWrapper
								editable={true} /* will component be editable or only rendered */
								showMetadata={true}
								model={this.state}
								enableResponsive={true}
								className={svgWrapperClassName.mobile}
								svgClassName={this.props.renderedSVGClassName}
							/>
							<div></div>
						</div>
					</div>

				</div>
			);
		}
		return (
			<div className={'chartbuilder-main'+ draftSave + " " + chartPublish}>
				<div className="chartbuilder-renderer">
					<div className="desktop">
						<RendererWrapper
							editable={true} /* will component be editable or only rendered */
							model={this.state}
							enableResponsive={false}
							width={640}
							showMetadata={true}
							className={svgWrapperClassName.desktop}
							svgClassName={this.props.renderedSVGClassName}
						/>
					</div>
					{this._renderChartDetailPreview()}
					{mobilePreview}
				</div>
				<div className="chartbuilder-editor">
					<LocalStorageTimer
						timerOn={this.state.session.timerOn}
					/>
					<ChartTypeSelector
						metadata={this.state.metadata}
						chartProps={this.state.chartProps}
						errors={this._getEditorAlerts()}
					/>
					<Editor
						errors={this._getEditorAlerts()}
						session={this.state.session}
						chartProps={this.state.chartProps}
						numColors={this._getNumColors()}
					/>
					<ChartMetadata
					    errors={this._getAlerts(null, true)}
						metadata={this.state.metadata}
						data={this.state.chartProps.data}
						stepNumber={String(numSteps)}
						additionalComponents={this.props.additionalComponents.metadata}
						onAdditionalComponentUpdate={this._onAdditionalComponentUpdate}
					/>
					{mobileOverrides}
					
					<ChartExport
						data={this.state.chartProps.data}
						enableJSONExport={this.props.enableJSONExport}
						svgWrapperClassName={svgWrapperClassName.desktop}
						metadata={this.state.metadata}
						stepNumber={String(numSteps + 2)}
						additionalComponents={this.props.additionalComponents.misc}
						model={this.state}
					/>
					
					{this._renderSaveButton()}
					
					{this._renderSaveDraftButton()}
					
					<div className="requiredCallToAction">
						* Field required for publishing
					</div>
					
					{this._renderErrors()}
					
				</div>
				<div className="chartbuilder-canvas">
					<Canvas />
				</div>
			</div>
		);
	},

	/**
	 * Function that is fired any time a change is made to a chart. By default it
	 * fetches the latest chart state from the stores and updates the Chartbuilder
	 * component with that state. If `autosave` is set to `true`, it will also
	 * update `localStorage` with the new state.
	 * @name _onChange
	 * @instance
	 * @memberof Chartbuilder
	 */
	_onChange: function() {
		// On change, update and save state.
		var state = getStateFromStores();
		this.setState(state);

		if (this.props.autosave && !this.state.session.timerOn) {
			ChartbuilderLocalStorageAPI.saveChart(state);
		}

		// If Chartbuilder is embedded as a module,
		// accept onStateChange callback to update parent app
		if(this.props.onStateChange) {
			this.props.onStateChange({
				chartProps: state.chartProps,
				metadata: state.metadata
			});
		}
	}

});

module.exports = Chartbuilder;
