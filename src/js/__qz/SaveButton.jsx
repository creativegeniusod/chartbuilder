/*
 * ### SaveButton.jsx
*/

/* Node modules */
var React = require("react");
var Button = require("chartbuilder-ui").Button;
var PropTypes = React.PropTypes;
var saveSvgAsPng = require("save-svg-as-png");
var leach = require("lodash/each");

var SaveButton = React.createClass({

  propTypes: {
    onSave: PropTypes.func,
    disabled: PropTypes.bool,
    active: PropTypes.bool,
    isDraft: PropTypes.bool
  },

  getDefaultProps: function() {
    return {
      disabled: false,
      active: true,
      isDraft: false
    };
  },

  _pngScales: [{
    name: "png",
    scale: 1,
    size: "desktop"
  }, {
    name: "png2x",
    scale: 2,
    size: "desktop"
  }],

  getInitialState: function() {
    return {
      isSaving: false
    }
  },

  _prepareModel: function(img, ratio) {
    var n = {
      chartProps: this.props.model.chartProps,
      metadata: this.props.model.metadata,
      images: img,
      aspectRatio: ratio
    };
    
    if(this.props.isDraft === true && n.chartProps.input.raw !== ""){
		this.setState({ justSavedDraft: true });
	}
	this.props.onSave(n, this.props.isDraft);
  },
  
  _generateDataUris: function() {
		var e = document.getElementsByClassName(this.props.desktopClass)[0],
			t = document.getElementsByClassName(this.props.mobileClass)[0],
			n = e.offsetWidth / e.offsetHeight,
			r = this;
		setTimeout(function() {
			var i = {};
			leach(r._pngScales, function(a) {
				var s;
				s = "desktop" === a.size ? e : t;
				var c = s.querySelectorAll('tspan[data-reactid*="Footer"]')[0];
				c && c.setAttribute("dy", "0.28em");
				var u = s.cloneNode(!0),
					l = u.querySelectorAll(".svg-text-title"),
					p = u.querySelectorAll(".svg-credit-data");
				l.length > 0 && l[0].parentNode.removeChild(l[0]), p.length > 0 && p[0].parentNode.removeChild(p[0]), o.svgAsRaw(s, {
					scale: a.scale
				}, function(e) {
					var t = e.slice(26);
					t = t.replace("xml version", 'xml encoding="UTF-8" version'), i[a.name] = t, Object.keys(i).length === 2 * r._pngScales.length && r.setState({
						isSaving: !1
					}, function() {
						r._prepareModel(i, n)
					})
				}), o.svgAsRaw(u, {
					scale: a.scale
				}, function(e) {
					var t = e.slice(26);
					t = t.replace("xml version", 'xml encoding="UTF-8" version'), i["__" + a.name + "__"] = t, Object.keys(i).length === 2 * r._pngScales.length && r.setState({
						isSaving: !1
					}, function() {
						r._prepareModel(i, n)
					})
				})
			})
		}, 0)
  },
	
	_handleClick: function(e) {
		var t = this;
		this.props.disabled === !1 && t.setState({
			isSaving: !0
		}, function() {
			t._generateDataUris(), t.props.onDraftSave && t.props.onDraftSave(), t.props.onBeforePublish && t.props.onBeforePublish()
		})
	},

	render: function() {
		var e, t = this.props.isDraft ? "save-draft-button" : "save-button";
		return this.state.isSaving ? (e = this.props.isDraft ? "Saving draft..." : "Publishing...", t += this.props.isDraft ? " draft-active" : " active") : e = this.props.isDraft ? this.state.justSavedDraft === !0 ? "Draft saved!" : this.props.isPublishedChart ? "Unpublish and Save draft" : "Save draft" : "Publish", this.props.isDraft && !this.props.active && (t += " disabled"), React.createElement(Button, {
			onClick: this._handleClick,
			text: e,
			className: t,
			active: this.props.active
		})
	}

});

module.exports = SaveButton;
