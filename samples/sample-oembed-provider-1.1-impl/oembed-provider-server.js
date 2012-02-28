var fs = require('fs');
var http = require('http');

var contentProviderServer = http.createServer(function(req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    fs.createReadStream('../../oembed-types/rich/page.html').pipe(res);
});

var oembedProviderServer = http.createServer(function(req, res) {
    res.writeHead(200, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Expose-Headers': 'link',
        'Content-Type': 'application/json',
        'Link': ['<.........>; rel=original; type=text/html', '<abc.txt>; rel=original; type=text/plain, <abc.xml>; rel=original; type=text/xml']
    });
    res.end(fs.readFileSync('../../oembed-types/rich/page-oembed.json'));
});

oembedProviderServer.listen(config.oembed-provider-server-port);
