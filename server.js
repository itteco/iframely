GLOBAL.CONFIG = require('./config');

var heapdump = require('heapdump');

console.log("");
console.log("Starting Iframely...");
console.log("Base URL for embed links that require renders:", CONFIG.baseAppUrl);


var path = require('path');
var express = require('express');
var sysUtils = require('./utils');
var NotFound = sysUtils.NotFound;

var app = express();

app.use(express.bodyParser());
app.set('view engine', 'ejs');

if (CONFIG.allowedOrigins) {
    app.use(function(req, res, next) {
        var origin = req.headers["origin"];

        if (origin) {
            if (CONFIG.allowedOrigins.indexOf('*') > -1) {
                res.setHeader('Access-Control-Allow-Origin', '*');
            } else {
                if (CONFIG.allowedOrigins.indexOf(origin) > -1) {
                    res.setHeader('Access-Control-Allow-Origin', origin);
                }
            }
        }
        next();
    });
}
app.disable( 'x-powered-by' );
app.use(function(req, res, next) {
    res.setHeader('X-Powered-By', 'Iframely');
    next();
}); 

app.use(sysUtils.cacheMiddleware);


require('./modules/api/views')(app);
require('./modules/debug/views')(app);
require('./modules/tests-ui/views')(app);

app.use(logErrors);
app.use(errorHandler);


function logErrors(err, req, res, next) {
    if (CONFIG.RICH_LOG_ENABLED) {
        console.error(err.stack);
    } else {
        console.log(err.message);
    }

    next(err);
}

function errorHandler(err, req, res, next) {

    if (err instanceof NotFound) {

        res.writeHead(404);
        res.end(err.message);

    } else {

        res.writeHead(err.code || 500);
        res.end(err.message);
    }
}

process.on('uncaughtException', function(err) {
    if (CONFIG.DEBUG) {
        console.log(err.stack);
    } else {
        console.log(err.message);
    }
});

app.get(CONFIG.relativeStaticUrl + '/*', function(req, res, next) {
    var url = '/' + req.url.split('/').splice(2).join('/');
    sysUtils.static(path.resolve(__dirname, 'static'), {path: url})(req, res, next);
});

app.get('/', function(req, res) {
    res.writeHead(302, { Location: 'http://iframely.com'});
    res.end();
});

app.listen(CONFIG.port);

console.log('Iframely listening on port', CONFIG.port);
console.log('- support@iframely.com - if you need help');
console.log('- twitter.com/iframely - for news & updates');
console.log('- github.com/itteco/iframely - star & contribute');