'use strict';
var React = require('react');
var ReactDOM = require('react-dom');
var debug = require('debug');
var bootstrapDebug = debug('Example');
var app = require('./fluxibleApp');
var dehydratedState = window.App; // Sent from the server
var ReactRouter = require('react-router');
var FluxibleComponent = require('fluxible-addons-react/FluxibleComponent');
var createElement = require('fluxible-addons-react/createElementWithContext');

bootstrapDebug('rehydrating app');

window.React = React; // For chrome dev tool support
debug.enable('*');

function RenderApp(context){
    bootstrapDebug('React Rendering');
    var mountNode = document.getElementById('app');
    ReactDOM.render(
        React.createElement(
            FluxibleComponent,
            { context: context.getComponentContext() },
            React.createElement(ReactRouter.Router, {
                routes: context.getComponent(),
                history: ReactRouter.browserHistory
            })
        ),
        mountNode,
        function () {
            bootstrapDebug('React Rendered');
        }
    );
}

app.rehydrate(dehydratedState, function (err, context) {
    if (err) {
        throw err;
    }
    window.debug = debug;
    window.context = context;

    RenderApp(context);
});
