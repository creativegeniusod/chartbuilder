var ChartServerActions = require("./ChartServerActions");

var ChartFormActions = {
	
	set: function(e) {
        ChartServerActions.receiveModel(e)
    }

};

module.exports = ChartFormActions;
