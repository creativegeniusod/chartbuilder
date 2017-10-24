var HtmlComponent = require('./src/js/components/Html');
var express = require('express');
var favicon = require('serve-favicon');
var serialize = require('serialize-javascript');
var navigateAction = require('./src/js/actions/navigate').navigate;
var renderToStaticMarkup = require('react-dom/server').renderToStaticMarkup;
var renderToString = require('react-dom/server').renderToString;
var debug = require('debug')('Example');
var React = require('react');
var fluxibleApp = require('./src/js/fluxibleApp');
var FluxibleComponent = require('fluxible-addons-react/FluxibleComponent');
var router = require('react-router');
var match = router.match;
var RouterContext = router.RouterContext;
var swig = require('swig');
var csrf = require('csurf');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var config = require('./config');
var Chart = require('./models/chart');
var mongoose = require('mongoose');

var fs = require('fs');
var svg2img = require('svg2img');
var atob = require('atob');
//var browserify = require('browserify-middleware');
var svg_to_png = require('svg-to-png');
var path = require( 'path' );

var app = express();

mongoose.connect(config.database);
mongoose.connection.on('error', function() {
  console.info('Error: Could not connect to MongoDB. Did you forget to run `mongod`?'.red);
});

app.use(express['static'](__dirname + '/build'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

//app.use(cookieParser());
app.use(bodyParser.json());
//app.use(csrf({cookie: true}));
//app.get('./build/main.js', browserify('./src/js/client.js'));


/**
 * POST /api/charts
 * Adds new chart to the database.
 */

app.post('/api/charts', function(req, res, next) {
	
	var chartData = req.body.chart;
	var dataDownloadable, embeddable, imageDownloadable, inFeeds, description;
	
	if ( typeof chartData.dataDownloadable !== 'undefined' && chartData.dataDownloadable ) {
        dataDownloadable = chartData.dataDownloadable;
    } else {
		dataDownloadable = true;
	}
	
	if ( typeof chartData.embeddable !== 'undefined' && chartData.embeddable ) {
        embeddable = chartData.embeddable;
    } else {
		embeddable = true;
	}
	
	if ( typeof chartData.imageDownloadable !== 'undefined' && chartData.imageDownloadable ) {
        imageDownloadable = chartData.imageDownloadable;
    } else {
		imageDownloadable = true;
	}
	if ( typeof chartData.inFeeds !== 'undefined' && chartData.inFeeds ) {
        inFeeds = chartData.inFeeds;
    } else {
		inFeeds = true;
	}
	if ( typeof chartData.description !== 'undefined' && chartData.description ) {
        description = chartData.description;
    } else {
		description = null;
	}

	
	var title = chartData.title;
	var source = chartData.model.metadata.source;
	var tags = chartData.model.metadata.tags;
    var aspectRatio = chartData.aspectRatio;
    var isDraft = chartData.isDraft;
    var model = chartData.model;
	
	var chart = new Chart({
	  title: title,
	  source: source,
	  tags: tags,
	  description: description,
	  dataDownloadable:dataDownloadable,
	  embeddable:embeddable,
	  imageDownloadable:imageDownloadable,
	  inFeeds:inFeeds,
	  aspectRatio:aspectRatio,
	  isDraft:isDraft,
	  model:model
	});

	chart.save(function(err, result) {
	  if (err) return next(err);
	  res.send({chart:result});
	});
	
});


/**
 * POST /api/charts/saveImages
 * Save chart images to the database.
*/

app.post('/api/charts/saveImages', function(req, res, next) {
    var chartId = req.body.chartId;
    var appPng = req.body.images.app.png;
    var appPng2x = req.body.images.app.png2x;
    var atlasPng = req.body.images.atlas.png;
    var atlasPng2x = req.body.images.atlas.png2x;
    
    var apppng = appPng.slice(26);
    var apppng2x = appPng2x.slice(26);
    var atlaspng = atlasPng.slice(26);
    var atlaspng2x = atlasPng2x.slice(26);
    var images = {};
     
    require("fs").writeFile(path.resolve(path.join(__dirname, "files", chartId+".svg")), apppng, "base64", function(err) {
		if(err){
			console.log(err); 
		}
		else {
			svg_to_png.convert(path.resolve(path.join(__dirname, "files", chartId+".svg")), path.resolve(path.join(__dirname, "files"))) // async, returns promise
			.then( function(){
			});
		}
	});
	
	require("fs").writeFile(path.resolve(path.join(__dirname, "files", chartId+"@2x.svg")), apppng2x, "base64", function(err) {
		if(err){
			console.log(err); 
		}
		else {
			svg_to_png.convert(path.resolve(path.join(__dirname, "files", chartId+"@2x.svg")), path.resolve(path.join(__dirname, "files"))) // async, returns promise
			.then( function(){
			});
		}
	});
	require("fs").writeFile(path.resolve(path.join(__dirname, "files", "atlas_"+chartId+".svg")), atlaspng, "base64", function(err) {
		if(err){
			console.log(err); 
		}
		else {
			svg_to_png.convert(path.resolve(path.join(__dirname, "files", "atlas_"+chartId+".svg")), path.resolve(path.join(__dirname, "files"))) // async, returns promise
			.then( function(){
			});
		}
	});
	require("fs").writeFile(path.resolve(path.join(__dirname, "files", "atlas_"+chartId+"@2x.svg")), atlaspng2x, "base64", function(err) {
		if(err){
			console.log(err); 
		}
		else {
			svg_to_png.convert(path.resolve(path.join(__dirname, "files", "atlas_"+chartId+"@2x.svg")), path.resolve(path.join(__dirname, "files"))) // async, returns promise
			.then( function(){
			});
		}
	});
	
	images = {
		atlas:{
			png:"atlas_"+chartId+".png",
			png2x:"atlas_"+chartId+"@2x.png"
		},
		app:{
			png:chartId+".png",
			png2x:chartId+"@2x.png"
		}
	};
	
	Chart.findById(req.body.chartId, (err, chart) => {		
		if (err) {
		  return next(err);
		}else {
			
			chart.images = images || chart.images;
			chart.save((err, chart) => {
				if (err) {
					res.status(500).send(err)
				}
				res.status(200).send({chart:chart});
			});
		}
	});
});

/**
 * GET /api/auth/draftCount
*/
app.get('/api/auth/draftCount', function(req, res, next) {
	res.status(200).send({count:0});
});

app.get('/*', function(req, res, next){ 
  res.setHeader('Last-Modified', (new Date()).toUTCString());
  next(); 
});

app.use(function (req, res, next) {
    match({
        routes: fluxibleApp.getComponent(),
        location: req.url
    }, function (error, redirectLocation, renderProps) {
        if (error) {
            res.status(500).send(error.message);
        } else if (redirectLocation) {
            res.redirect(302, redirectLocation.pathname + redirectLocation.search);
        } else if (renderProps) {
            //var context = fluxibleApp.createContext();
            
            var context = fluxibleApp.createContext({
				req: req,
				headers: {
					csrfToken: "fW7UqZsy-CKW4uM0UPk6JvoELf4uYPSZXnQw"
				}
			});
            
            context.executeAction(navigateAction, {path: req.url}, function () {
                debug('Exposing context state');
                var exposed = 'window.App=' + serialize(fluxibleApp.dehydrate(context)) + ';';
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
app.listen(port);
console.log('Listening on port ' + port);
