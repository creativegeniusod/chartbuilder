var React = require("react");
var Router = require("react-router");
var ReactDom = require("react-dom");
var PropTypes = React.PropTypes;
        
module.exports = React.createClass({
	displayName: "exports",
	
	propTypes: {
        position: PropTypes.string
    },
            
	mixins: [Router.State, Router.Navigation],
	
	getInitialState: function() {
		return {
			query: ""
		}
	},
	
	componentDidMount: function() {
		"results" === this.props.position && (this.refs.search.value = this.props.query, this.setState({
			query: this.props.query
		}), this.refs.search.classList.remove("submitted"), "" === this.state.query.trim() && this.refs.search.focus()), "index" === this.props.position && window.innerWidth > 1100 && this.refs.search.focus()
	},
	
	componentWillReceiveProps: function(e) {
		"results" === this.props.position && (this.refs.search.value = e.query)
	},
	
	_handleQueryChange: function(e) {
		var t = {
			query: e.target.value
		};
		this.setState(t)
    },
    
	_clearInput: function() {
		this.refs.search.value = ""
	},
    
    _onSubmit: function(e) {
		e.preventDefault(), "results" !== this.props.position && this._clearInput(), this.refs.search.classList.add("submitted"), this.transitionTo("searchWQuery", {
			q: this.state.query.trim()
		})
	},
	
	render: function() {
		var search; 
		var searchClass = "search search-" + this.props.position;
		
		if(typeof window == "undefined"){
			search= "";
		}
		
		if(typeof window != "undefined" && window.innerWidth < 1025 ){
			search = "Tap to search";
		}else {
			search = "Type to search";
		}
		
		return(
			<form className={searchClass} role ="search" onClick={this.props.onFormClicked} onSubmit={this._onSubmit}>
				<div className="input-group">
					<input type="text" ref="search" className="form-control" onChange={this._handleQueryChange} placeholder={search} />
					<span className="input-group-btn">
						<button className="btn btn-default" type="submit">Search</button>
					</span>			
				</div>
			</form>
		);
	}
});
