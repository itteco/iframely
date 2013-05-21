GLOBAL.CONFIG = require('./config');

var iframely_proxy = require('./lib/iframely-proxy');

//iframely_proxy.getRawLinks("http://www.flickr.com/photos/jup3nep/8243797061/?f=hp");
//iframely_proxy.getRawLinks("http://dippoetry.dipdive.com/media/151409");
//iframely_proxy.getRawLinks("http://visual.ly/spring-cleaning-improve-energy-efficiency");
//iframely_proxy.getRawLinks("http://techcrunch.com/2013/05/08/cardflight-partners-with-stripe-and-launches-sdk-to-become-the-stripe-of-real-world-payments/");
//iframely_proxy.getRawLinks("http://habrahabr.ru/company/mailru/blog/179113/");
//iframely_proxy.getRawLinks("http://test.com/");
//iframely_proxy.getRawLinks("http://www.youtube.com/watch?v=etDRmrB9Css");

var path = require('path');
var express = require('express');
var sysUtils = require('./utils');
var NotFound = sysUtils.NotFound;

var app = express();

app.use(express.bodyParser());
app.set('view engine', 'ejs');
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

app.get('/r3/*', function(req, res, next) {
    var url = '/' + req.url.split('/').splice(2).join('/');
    sysUtils.static(path.resolve(__dirname, 'static'), {path: url})(req, res, next);
});

app.listen(CONFIG.port);
console.log('Listening on port', CONFIG.port);