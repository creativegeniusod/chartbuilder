var HtmlComponent = require('./src/js/components/Html');
var express = require('express');
var favicon = require('serve-favicon');
var serialize = require('serialize-javascript');
var navigateAction = require('./src/js/actions/navigate').navigate;
var renderToStaticMarkup = require('react-dom/server').renderToStaticMarkup;
var renderToString = require('react-dom/server').renderToString;
var debug = require('debug')('Example');
var React = require('react');
var app = require('./src/js/fluxibleApp');
var FluxibleComponent = require('fluxible-addons-react/FluxibleComponent');
var router = require('react-router');
var match = router.match;
var RouterContext = router.RouterContext;
var swig = require('swig');

var server = express();
server.use(express['static'](__dirname + '/build'));

//console.log(HtmlComponent);
console.log(app);


/*if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  var localStorage = new LocalStorage('./scratch');
}*/


server.use(function (req, res, next) {
    debug('Executing navigate action');
    match({
        routes: app.getComponent(),
        location: req.url
    }, function (error, redirectLocation, renderProps) {
        if (error) {
            res.status(500).send(error.message);
        } else if (redirectLocation) {
            res.redirect(302, redirectLocation.pathname + redirectLocation.search);
        } else if (renderProps) {
            var context = app.createContext();
            context.executeAction(navigateAction, {path: req.url}, function () {
                debug('Exposing context state');
                var exposed = 'window.App=' + serialize(app.dehydrate(context)) + ';';
                var markupElement = React.createElement(
                        FluxibleComponent,
                        { context: context.getComponentContext() },
                        React.createElement(RouterContext, renderProps)
                    );
                
                var html = renderToString(markupElement);
                var page = swig.renderFile('./src/htdocs/index.html', { html: html, context:context.getComponentContext(), state:exposed });
				res.status(200).send(page);
                /*var html = renderToStaticMarkup(
                    <HtmlComponent
                        context={context.getComponentContext()}
                        state={exposed}
                        markup={renderToString(markupElement)}
                    />
                );

                debug('Sending markup');
                res.status(200).send(html);*/
            });
        } else {
            next();
        }
    })
});

var port = process.env.PORT || 3001;
server.listen(port);
console.log('Listening on port ' + port);
