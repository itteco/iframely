(function() {
    
var express = require('express');
var fs = require('fs');
var path = require('path');

var baseUrl = 'http://provider.iframely.com';
var mimeTypes = {
    html: 'text/html',
    jpg: 'image/jpeg',
    json: 'application/json',
    mp4: 'video/mp4',
    png: 'image/png'
};

var app = express.createServer();

app.get('/:type/', function(req, res) {
    res.writeHead(200, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Expose-Headers': 'Link',
        'Link': '<' + baseUrl + '/oembed?url=' + encodeURIComponent(baseUrl + '/' + req.param('type') + '/') + '>; rel=alternate; type=application/oembed+json',
        'Content-Type': mimeTypes.html
    });
    fs.createReadStream(__dirname + '/resources/oembed-types/'+ req.param('type') + '/index.html').pipe(res);
});

app.get('/:type/:file', function(req, res) {
    var file = req.param('file');
    res.writeHead(200, {
        'Content-Type': mimeTypes[path.extname(file).substr(1)] || 'application/octet-stream'
    });
    fs.createReadStream(__dirname + '/resources/oembed-types/'+ req.param('type') + '/' + file).pipe(res);
});

app.get('/oembed', function(req, res) {
    var url = req.param('url');
    if (url.substr(0, baseUrl.length) == baseUrl) {
        url = url.substr(baseUrl.length);
        
        res.writeHead(200, {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/oembed+json'
        });
        fs.createReadStream(__dirname + '/resources/oembed-types' + url + 'oembed.json').pipe(res);
        
    } else {
        res.writeHead(404);
        res.end();
    }
});

app.listen(process.env.npm_package_config_port || 8061);

})();
