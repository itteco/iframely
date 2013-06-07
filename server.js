GLOBAL.CONFIG = require('./config');


var path = require('path');
var express = require('express');
var sysUtils = require('./utils');
var NotFound = sysUtils.NotFound;

var app = express();

app.use(express.bodyParser());
app.set('view engine', 'ejs');

require('./modules/api/views')(app);
require('./modules/debug/views')(app);

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

app.get('/r3/*', function(req, res, next) {
    var url = '/' + req.url.split('/').splice(2).join('/');
    sysUtils.static(path.resolve(__dirname, 'static'), {path: url})(req, res, next);
});

app.listen(CONFIG.port);
console.log('Listening on port', CONFIG.port);