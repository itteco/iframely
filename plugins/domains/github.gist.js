module.exports = {

    re: /^https?:\/\/gist\.github\.com\/([\w\.\-]+\/)(\w+)(#([\w\.\-]+))?/i,

    mixins: [
        "og-site",
        "og-image",
        "domain-icon"
    ],

    getMeta: function(meta) {
        return (meta.og && meta.og.title) ? {
            title: meta.og.title,
            description: meta["html-title"]
        } : {
            title: meta["html-title"]
        };
    },

    getLink: function(urlMatch, request, cb) {
        var gistId = urlMatch[2];
        var filePermalink = urlMatch[4];

        if (!filePermalink) {
            // No hash
            return cb(null, {
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.reader, CONFIG.R.html5, CONFIG.R.ssl],
                html: '<script type="text/javascript" src="https://gist.github.com/' + gistId +'.js"></script>'
            });
        }

        // Unfortunately the permalinks to individual files used by Gist don't match
        // the ?file= parameter, so we need to fetch a list of the files in the Gist
        // and attempt to manually match the permalink to a filename
        request({
                uri: 'https://api.github.com/gists/' + gistId,
                json: true,
                headers: {
                    'User-Agent': 'iframely/gist'
                },
                jar: false,
                prepareResult: function (error, response, body, cb) {

                    var fileName, scriptUrl, i, fileNames;

                    if (error) { return cb(error); }
                    if (response.statusCode !== 200) { return cb(body.message || "HTTP " + response.statusCode); }

                    fileNames = body.files && Object.keys(body.files) || [];

                    // Find a file with a matching hash...
                    for(i = 0; i < fileNames.length; i++) {
                        // File permalinks use #file-readme-txt style format

                        var p = 'file-' + fileNames[i].toLowerCase();
                        p = p.replace(/\./g, '-').replace(/[^\w\-]+/g,'');

                        if (p === filePermalink) {
                            fileName = fileNames[i];
                            break;
                        }
                    }

                    if (fileName) {
                        scriptUrl = 'https://gist.github.com/' + gistId +'.js?file=' + encodeURIComponent(fileName);
                    } else {
                        scriptUrl = 'https://gist.github.com/' + gistId +'.js';
                    }

                    return cb(null, {
                        type: CONFIG.T.text_html,
                        rel: [CONFIG.R.reader, CONFIG.R.ssl, CONFIG.R.html5],
                        html: '<script type="text/javascript" src="' + scriptUrl + '"></script>'
                    });
                }
            }, cb);

    },

    tests: [{
        page: "https://gist.github.com/discover",
        selector: "a.link-overlay"
    }, {
        skipMixins: ["og-image", "og-site"]
    },
        "https://gist.github.com/3054754",
        "https://gist.github.com/2719090",
        "https://gist.github.com/schisamo/163c34f3f6335bc12d45",
        "https://gist.github.com/iparamonau/635df38fa737a1d80d23",
        "https://gist.github.com/suprememoocow/a26a7cc168a71cc3c69b#file-script-alert-1-script"
    ]
};
