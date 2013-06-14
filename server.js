GLOBAL.CONFIG = require('./config');


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

require('./modules/api/views')(app);
require('./modules/debug/views')(app);
require('./modules/test-dashboard/views')(app);

app.use(logErrors);
app.use(errorHandler);


function logErrors(err, req, res, next) {
    console.error(err.stack);
    next(err);
}

function errorHandler(err, req, res, next) {

    if (err instanceof NotFound) {

        res.writeHead(404);
        res.end(err.message);

    } else {

        res.writeHead(500, 'Infernal Server Error');
        res.end(err.message);
    }
}

process.on('uncaughtException', function(err) {
    console.log(err.stack);
});

app.get(CONFIG.relativeStaticUrl + '/*', function(req, res, next) {
    var url = '/' + req.url.split('/').splice(2).join('/');
    sysUtils.static(path.resolve(__dirname, 'static'), {path: url})(req, res, next);
});

app.listen(CONFIG.port);
console.log('Listening on port', CONFIG.port);