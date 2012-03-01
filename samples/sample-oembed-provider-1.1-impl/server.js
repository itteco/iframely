(function() {

process.title = 'iframely-sample';

var express = require('express');
var fs = require('fs');
var path = require('path');

var mimeTypes = {
    html: 'text/html',
    jpg: 'image/jpeg',
    json: 'application/json',
    mp4: 'video/mp4',
    png: 'image/png'
};

var typesPath = path.join(__dirname, 'resources/oembed-types');

var app = exports.app = express.createServer();

app.baseUrl = 'http://provider.iframe.ly';

app.get('/:type/', function(req, res) {
    var filepath = path.join(typesPath, req.param('type'), 'index.html');
    path.exists(filepath, function(exists) {
        if (exists) {
            res.writeHead(200, {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Expose-Headers': 'Link',
                'Link': '</oembed?url=' + encodeURIComponent(app.baseUrl + '/' + req.param('type') + '/') + '>; rel=alternate; type="application/json+oembed"',
                'Content-Type': mimeTypes.html
            });
            fs.createReadStream(filepath).pipe(res);
            
        } else {
            res.writeHead(404);
            res.end();
        }
    });
});

app.get('/:type/:file', function(req, res) {
    var file = req.param('file');
    var filepath = path.join(typesPath, req.param('type'), file);
    path.exists(filepath, function(exists) {
        if (exists) {
            res.writeHead(200, {
                'Content-Type': mimeTypes[path.extname(file).substr(1)] || 'application/octet-stream'
            });
            fs.createReadStream(filepath).pipe(res);
            
        } else {
            res.writeHead(404);
            res.end();
        }
    });
});

app.get('/oembed', function(req, res) {
    var url = req.param('url');
    if (url.substr(0, app.baseUrl.length) == app.baseUrl) {
        url = url.substr(app.baseUrl.length + 1);
        
        var filepath = path.join(typesPath, url, 'oembed.json');
        path.exists(filepath, function(exists) {
            if (exists) {
                res.writeHead(200, {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json+oembed'
                });
                fs.createReadStream(filepath).pipe(res);
            
            } else {
                res.writeHead(404);
                res.end();
            }
        });
        
    } else {
        res.writeHead(404);
        res.end();
    }
});

app.listen(process.env.npm_package_config_port || 8061);

process.on('uncaughtException', function (error) {
    console.error(error);
    console.error(error.stack);
});

})();
