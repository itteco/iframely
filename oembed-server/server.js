(function() {

var _ = require('underscore');
var events = require('events');
var express = require('express');
var sax = require('sax');

var iframely = require('./iframely');

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
//    httpUtils.rateLimit(httpUtils.header('referrer'), 10, 60000)
//    express.bodyParser()
);

app.get('/oembed/1', function(req, res) {
    var pageUrl = decodeURIComponent(req.param('url'));
    var iframe = req.param('iframe');
    var format = req.param('format');
    
    var options = {
        format: format,
        iframe: req.param('iframe'),
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
            var stream = oembedRes.headers['content-type'].match('xml')?
                xmlStream2oembed(oembedRes):
                jsonStream2oembed(oembedRes)

            stream
                .on('error', function(error) {
                    console.error('error', error);
                    res.writeHead(500, 'Internal Server Error', COMMON_HEADERS);
                    res.end();
                })
                .on('oembed', function(oembed) {
                    if (iframe) {
                        oembed.html = '<iframe src="http://iframe.ly/iframe/1?url=' + encodeURIComponent(oembedRes.oembedUrl) + '></iframe>';
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
                });
        }
    });
});

app.get('/iframe/1', function(req, res) {
    var oembedUrl = decodeURIComponent(req.param('url'));
    iframely.getOembedByProvider(oembedUrl, {}, function(error, oembedRes) {
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
            var stream = oembedRes.headers['content-type'].match('xml')?
                xmlStream2oembed(oembedRes):
                jsonStream2oembed(oembedRes)

            stream.on('error', function(error) {
                console.error('error', error);
                res.writeHead(500);
                res.end();
            })
            .on('oembed', function(oembed) {
                res.writeHead(200, {
                    'Content-Type': 'text/html'
                });
                res.end(oembed.html);
            });
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

function xmlStream2oembed(stream) {
    var promise = new events.EventEmitter();

    var oembed;
    var prop;
    var value;

    var saxStream = sax.createStream();
    saxStream.on('error', function(err) {
        promise.emit('error', err);
    });
    saxStream.on('opentag', function(tag) {
        if (tag.name === 'OEMBED') {
            oembed = {};
            
        } else if (oembed) {
            prop = tag.name.toLowerCase();
            value = "";
        }
    });
    saxStream.on('text', function(text) {
        if (prop) value += text;
    });
    saxStream.on('cdata', function(text) {
        if (prop) value += text;
    });
    saxStream.on('closetag', function(name) {
        if (name === 'OEMBED') {
            promise.emit('oembed', oembed);
            
        } else {
            if (prop) {
                oembed[prop] = value;
            }
            prop = null;
        }
    });

    stream.pipe(saxStream);
    
    return promise;
}

function jsonStream2oembed(stream) {
    var promise = new events.EventEmitter();

    var data = "";
    stream.on('data', function(chunk) {
        data += chunk;
        
    }).on('end', function() {
        try {
            data = JSON.parse(data);
            
        } catch (e) {
            promise.emit('error', e);
            return;
        }
        
        promise.emit('oembed', data);
    });
    
    return promise;
}

app.listen(8060);
console.log('Listening', 8060);

})();
