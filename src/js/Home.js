var React = require("react");
var Router = require("react-router");
var Search = require("./components/Search");

module.exports = React.createClass({
	
	statics: {
		documentMeta: function(e, t, n, r) {
			return {
				url: n
			}
		},
		
		/*tracking: function(e, t) {
			return options = {
				keen: {
					type: "page",
					subtype: "home"
				}
			}
		}*/
    },

	render: function() {
		console.log('ddd');
		return(
			<div id="index">
				<div className="hero">
					<div className="home-hero-text">
						<div className="logo"></div>
						<div className="tagline">
							{'The new home for charts and data, powered by'} <a href={'//qz.com'}>Quartz.</a>
						</div>
						<div className="search-container">
							<Search
								position="index"
							/>
						</div>
					</div>
				</div>
			</div>
		);	
	}
});
