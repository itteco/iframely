(function() {

process.title = 'iframely-proxy';

var _ = require('underscore');
var express = require('express');

var iframely = require('../iframely-node');

const COMMON_HEADERS = {
    'Access-Control-Allow-Origin': '*'
};

const ALLOWED_IN_HEADERS = [
    'If-Modified-Since',
    'If-None-Match',
];

const ALLOWED_OUT_HEADERS = [
    'Content-Description',
    'Content-Type',
    'ETag',
    'Expires',
    'Last-Modified'
];

var app = express.createServer(
    express.logger()
//    httpAssert.rateLimit(httpAssert.header('referrer'), 10, 60000)
//    express.bodyParser()
);

app.get('/oembed/1', function(req, res) {
    var pageUrl = decodeURIComponent(req.param('url'));
    var iframe = req.param('iframe');
    var format = req.param('format');
    
    var options = {
        format: format,
        iframe: iframe,
        maxwidth: req.param('maxwidth'),
        maxheight: req.param('maxheight'),
        headers: filterInHeaders(req.headers)
    };
        
    iframely.getOembed(pageUrl, options, function(error, oembedRes) {
        if (error) {
            if (error.error == 'not-modified') {
                res.writeHead(304, COMMON_HEADERS);
                res.end();

            } else if (error.error == 'not-found') {
                res.writeHead(404, COMMON_HEADERS);
                res.end();

            } else {
                console.error('error', error);
                res.writeHead(500, 'Internal Server Error', COMMON_HEADERS);
                res.end();
            }

        } else if ((!format || oembedRes.headers['content-type'].match(format)) && !iframe) {
            res.writeHead(200, _.extend(filterOutHeaders(oembedRes.headers), COMMON_HEADERS));
            oembedRes.pipe(res);

        } else {
            oembedRes.toOembed(function(error, oembed) {
                if (error) {
                    console.error('error', error);
                    res.writeHead(500, 'Internal Server Error', COMMON_HEADERS);
                    res.end();
                    
                } else {
                    if (iframe) {
                        oembed.html = '<iframe src="http://iframe.ly/iframe/1?url=' + encodeURIComponent(oembedRes.oembedUrl) + '"></iframe>';
                    }

                    if (format == 'json') {
                        res.writeHead(200, _.extend(filterOutHeaders(oembedRes.headers), {'Content-Type': 'application/json+oembed'}, COMMON_HEADERS));
                        res.end(JSON.stringify(oembed));

                    } else {
                        res.writeHead(200, _.extend(filterOutHeaders(oembedRes.headers), {'Content-Type': 'application/xml+oembed'}, COMMON_HEADERS));
                        res.write('<?xml version="1.0"?>\n');
                        res.write('<oembed>\n');

                        _.each(oembed, function(value, prop) {
                            res.write('<' + prop + '>');
                            res.write(value);
                            res.write('</' + prop + '>');
                        });

                        res.end('</oembed>\n');
                    }
                }
            });
        }
    });
});

app.get('/iframe/1', function(req, res) {
    var oembedUrl = decodeURIComponent(req.param('url'));
    iframely.getOembedByProvider(oembedUrl, {type: 'object'}, function(error, oembed) {
        if (error) {
            if (error.error == 'not-found') {
                res.writeHead(404);
                res.end();
                
            } else {
                console.log(error);
                res.writeHead(500);
                res.end();
            }
            
        } else {
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
            res.end(oembed.html);
        }
    });
});

function filterHeaders(headers, allowed) {
    var filtered = {};
    
    allowed.forEach(function(header) {
        var key = header.toLowerCase();
        if (key in headers)
            filtered[header] = headers[key];
    });
    
    return filtered;
}

function filterInHeaders(headers) {
    return filterHeaders(headers, ALLOWED_IN_HEADERS);
}

function filterOutHeaders(headers) {
    return filterHeaders(headers, ALLOWED_OUT_HEADERS);
}

app.listen(process.env.npm_package_config_port);
console.log('Listening', process.env.npm_package_config_port);

process.on('uncaughtException', function (error) {
    console.error(error);
    console.error(error.stack);
});

})();
