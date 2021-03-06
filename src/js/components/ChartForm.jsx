// Export chart to PNG or SVG

var React = require('react');
var ReactDom = require('react-dom');
var ReactRouter = require('react-router');
var isUndefined = require("lodash/isUndefined");
var lget = require("lodash/get");
var isString = require("lodash/isString");
var isEmpty= require("lodash/isEmpty");
var filter = require("lodash/filter");
var d = "undefined" != typeof window;
//var FluxibleMixin = require("fluxible-addons-react/FluxibleMixin");

var ChartActions = require("../actions/ChartActions");
var ChartFormActions = require("../actions/ChartFormActions");
var ChartStyles = require("./ChartStyles.jsx");
            
var Description = require("./chartFields/Description.jsx");
var Tags = require("./chartFields/Tags.jsx");
var SourceUrl = require("./chartFields/SourceUrl.jsx");
var OrgDropdown = require("./chartFields/OrgDropdown.jsx");
var ToggleFields = require("./chartFields/ToggleFields.jsx");
//var SponsorFields = require("./chartFields/SponsorFields.jsx");
var AuthStore = require("../stores/AuthStore");
var ChartStore = require("../stores/ChartStore");
var Chartbuilder = require("./Chartbuilder.jsx");

var ChartForm = React.createClass({

	//mixins: [FluxibleMixin],
	
	statics: {
		storeListeners: {
			onAuthStoreChange: [AuthStore]
		}
    },
    
    getInitialState: function() {
		var chartId = this.props.chart && this.props.chart._id;
		return {
			isEdit: false,
			validation: {},
			chartId: chartId
		}
	},
	
	onAuthStoreChange: function() {
		var e = this.getStore(AuthStore);
		if (u(e.user)) return this.replaceWith("index")
	},
	
	getToggleFieldDefaults: function() {
		var e = this.props.chart,
			t = {
				dataDownloadable: "undefined" == typeof(e && e.dataDownloadable) || e.dataDownloadable,
				embeddable: "undefined" == typeof(e && e.embeddable) || e.embeddable,
				imageDownloadable: "undefined" == typeof(e && e.imageDownloadable) || e.imageDownloadable,
				inFeeds: "undefined" == typeof(e && e.inFeeds) || e.inFeeds
			},
			n = function(e) {
				return t[e] === !0 ? "on" : "off"
			};
		return [{
			name: "dataDownloadable",
			label: "Data download " + n("dataDownloadable"),
			value: t.dataDownloadable
		}, {
			name: "embeddable",
			label: "Chart embed " + n("embeddable"),
			value: t.embeddable
		}, {
			name: "imageDownloadable",
			label: "Image download " + n("imageDownloadable"),
			value: t.imageDownloadable
		}, {
			name: "inFeeds",
			label: "Chart appearance in feeds/search " + n("inFeeds"),
			value: t.inFeeds
		}]
	},
	
	componentDidMount: function() {
		var e, t = this;
		document.body.classList.add("chart-edit"), d && (e = setTimeout(t.renderChart, 1000), window.chartFormUnload = window.chartFormUnload || function(e) {
			var t = e.currentTarget.performance;
			if (t && t.navigation && (1 === t.navigation.type || 2 === t.navigation.type)) {
				var n = "Do you really want to leave?";
				return e.returnValue = n, n
			}
		}, window.addEventListener("beforeunload", window.chartFormUnload), "function" == typeof Keen && "function" == typeof Keen.ready && Keen.ready(function() {
			clearTimeout(e), t.renderChart()
		}))
	},
	
	componentWillUnmount: function() {
		ReactDom.unmountComponentAtNode(this.refs.chart), document.body.classList.remove("chart-edit")
	},
	
	
	getOrganizationPaletteLength: function() {	
		var t = 11;
		return t;
	},
	
	renderChart: function() {
		var t = [React.createElement(SourceUrl, {
				key: "sourceUrl"
			}), React.createElement(Tags, {
				key: "tags"
			}), React.createElement(Description, {
				key: "description"
			})];

		var c = {
				id: "",
				model: {
					metadata: {}
				},
				updatedAt: new Date,
				tags: ["test"]
			},
			p = {
				metadata: t,
				misc: {
					advancedOptions: [React.createElement(ToggleFields, {
						fields: this.getToggleFieldDefaults(),
						onUpdate: this.getAdditionalFieldState,
						key: "toggles"
					})]
				}
			};
		
		
		var h = false;
		this.props.chart && (h = !this.props.chart.isDraft);
		var g = React.createElement(Chartbuilder, {
			additionalComponents: p,
			onSave: this.saveChart,
			showMobilePreview: true,
			showSaveButton: true,
			renderedSVGClassName: "organization-default-colors",
			numColors: this.getOrganizationPaletteLength(),
			validateMeta: this._validateMeta,
			validateData: this._validateData,
			isPublishedChart: h,
			onAdditionalComponentUpdate: this._handleAdditionalComponentChanges
		});
		if (this.props.chart) this.setState({
			isEdit: true
		}), ChartFormActions.set(this.formatChartModel(this.props.chart.model));
		else {
			var v = require("../config/default-input"),
				A = require("../charts/chart-type-configs").xy,
				T = A.defaultProps;
			T.chartProps.input = {
				raw: v,
				status: "VALID",
				valid: true
			}, ChartFormActions.set(this.formatChartModel(T))
		}
		ReactDom.render(g, ReactDom.findDOMNode(this.refs.chart))
	},
	
	_validateMeta: function(e, t) {
		var n = [];
		return "string" == typeof e.title && e.title.length > 0 || n.push({
			metadata: "title",
			location: "",
			text: "Chart title is required.",
			type: "error"
		}), "string" == typeof e.title && e.title.length > 70 && n.push({
			metadata: "title",
			location: "",
			text: "Chart title can be a maximum of 70 characters in length.",
			type: "error"
		}), 0 === e.source.length && n.push({
			metadata: "source",
			location: "",
			text: "Source is required.",
			type: "error"
		}), (o(e.tags) || e.tags.length <= 0) && n.push({
			metadata: "tags",
			location: "",
			text: "At least one tag is required.",
			type: "error"
		}), t && (n = l(n, function(e) {
			return "title" === e.metadata && e.text.indexOf("required") !== -1
		})), n
	},
	
	_validateData: function(t) {
		var n, r = require("../config/default-input");
		return t.chartProps.input.raw === r && (n = {
			metadata: "data",
			location: "input",
			text: "Please change the default input data.",
			type: "error"
		}), n
	},
	
	getAdditionalFieldState: function(e) {
		this.setState(e)
	},
	
	_handleAdditionalComponentChanges: function(e, t) {
		var n, r;
		if ("organization" === e) return "-1" === t || t === -1 ? {
			numColors: 11
		} : (n = this.getStore(E).user.organization, r = n.palette && n.palette.length ? n.palette.length : 11, {
			numColors: r
		})
	},
	
	formatChartModel: function(e) {
		return "" === e.metadata.tags || isUndefined(e.metadata.tags) ? e.metadata.tags = [] : Array.isArray(e.metadata.tags) || (e.metadata.tags = e.metadata.tags.trim(), "," === e.metadata.tags.substr(-1) && (e.metadata.tags = e.metadata.tags.slice(0, -1)), e.metadata.tags = e.metadata.tags.replace(/['"?!]/gi, "").replace(/-/gi, " "), e.metadata.tags = e.metadata.tags.toLowerCase().replace(", ", ",").split(",")), e.metadata.tags = e.metadata.tags.map(function(e) {
			return e.trim()
		}), e
	},
	
	getChartOrganization: function() {
		if ("undefined" != typeof this.props.organization) return this.props.organizationId || null;
		if (this.props.chart && "undefined" != typeof this.props.chart.organization) return null === this.props.chart.organization ? null : this.props.chart.organization._id;
		var e = this.getStore(AuthStore).getUserPermissions();
		return e.organization ? e.organization._id : null
	},
	
	setChartOrganization: function(e) {
		var t, n, r = document.querySelector(".desktop svg"),
			i = document.querySelector(".mobile svg");
		this.props.onOrgChange && this.props.onOrgChange(e), r.classList.forEach(function(e) {
			e.indexOf("org") > -1 && r.classList.remove(e)
		}), i.classList.forEach(function(e) {
			e.indexOf("org") > -1 && r.classList.remove(e)
		}), t = e.target.value, n = "-1" === t ? "default" : t, r.classList.add("organization-" + n + "-colors"), i.classList.add("organization-" + n + "-colors")
	},
	
	formatChartData: function(e) {
		e = this.formatChartModel(e);
		var t = {
			title: e.metadata.title,
			description: e.metadata.description,
			tags: e.metadata.tags,
			model: {
				chartProps: e.chartProps,
				metadata: e.metadata
			},
			aspectRatio: e.aspectRatio,
			imageDownloadable: this.state.imageDownloadable,
			embeddable: this.state.embeddable,
			dataDownloadable: this.state.dataDownloadable,
			inFeeds: this.state.inFeeds,
			isDraft: e.isDraft
		};
		return this.state.isSponsor === !0 && (t.isSponsored = !0, t.sponsor = this.state.sponsor._id, t.sponsorLogo = this.state.sponsorLogo, t.sponsorImpressionTrackerUrl = this.state.sponsorImpressionTrackerUrl, t.sponsorClickTrackerUrl = this.state.sponsorClickTrackerUrl, t.sponsorThirdPartyClickTrackerUrl = this.state.sponsorThirdPartyClickTrackerUrl), t.organization = this.getChartOrganization(), {
			chart: t,
			images: {
				app: {
					png: e.images.__png__,
					png2x: e.images.__png2x__,
					mobile: e.images.__mobile__
				},
				atlas: {
					png: e.images.png,
					png2x: e.images.png2x,
					mobile: e.images.mobile
				}
			}
		}
	},
	
	saveChart: function(e) {
		var t = this.state.isEdit ? ChartActions.edit : ChartActions.create,
			n = this.formatChartData(e),
			r = n.chart,
			i = n.images,
			a = p("chart", r);
		if (a.valid || e.isDraft)
			if (!a.valid && e.isDraft) {
				var o = l(a.errors, function(e) {
					return "allowEmpty" === e.attribute && e.property.indexOf("metadata.title") !== -1
				});
				0 === o.length ? (window.removeEventListener("beforeunload", window.chartFormUnload), this.context.executeAction(t, {
					chart: r,
					chartId: this.state.chartId,
					images: i,
					routerContext: this.context
				})) : this.setState({
					validation: a
				})
			} else window.removeEventListener("beforeunload", window.chartFormUnload), this.context.executeAction(t, {
				chart: r,
				chartId: this.state.chartId,
				images: i,
				routerContext: this.context
			});
		else this.setState({
			validation: a
		})
	},
	
	deleteChart: function() {
		var e = g.deleteChart,
			t = {
				chartId: this.state.chartId,
				userId: this.state.user._id,
				routerContext: this.context
			};
		this.context.executeAction(e, t)
	},
	
	render: function() {
		var e, t, n, i = isUndefined(this.state.validation) || !this.state.validation.errors ? [] : this.state.validation.errors;

		var u = React.createElement(ChartStyles, {
				organization: {},
				embed: !1,
				addReset: !0
			});
		return React.createElement("form", {
			className: "chart-form-no-org"
		}, u, React.createElement("div", {
			ref: "chart",
			className: "organization-default-color"
		}), React.createElement("div", {
			className: "errors"
		}, i.map(function(e) {
			return React.createElement("span", {
				className: "label label-danger",
				key: e.property
			}, e.message)
		})))
	}

});

module.exports = ChartForm;
