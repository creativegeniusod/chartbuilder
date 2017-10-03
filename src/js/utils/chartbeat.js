function r() {
	_sf_async_config.authors = "", _sf_async_config.sections = ""
}

var chartbeat = {
	trackPageView: function(e) {
		r(), _sf_async_config.authors = e.prop17, pSUPERFLY.virtualPage(e.prop4, e.prop3)
	}
};

module.exports = chartbeat;
