var $ = require('jquery');
var jsdom = require('jsdom');
var urllib = require('url');

function fixURIs(parent, tag, _attr, baseUri){
    var tagsList = parent.getElementsByTagName(tag);

    for (var i=0; i < tagsList.length; i++) {
        var elURI = tagsList[i].getAttribute(_attr);
        if (elURI){
            tagsList[i].setAttribute(_attr, urllib.resolve(baseUri, elURI));
        }
    }
}

module.exports = {

    getLink: function(url, instapaper_flag, html, cb) {

        jsdom.env({
            html: html
        }, function(err, window) {

            if (err) {
                return cb(err);
            }

            var $selector = $.create(window);

            var content = $selector('.instapaper_body');

            content.find('.instapaper_ignore').remove();
            content.find('a[href=], a:not([href])').remove();

            if (content.length) {

                var parent = content[0];

                fixURIs(parent, "img", "src", url);
                fixURIs(parent, "source", "src", url);
                fixURIs(parent, "video", "src", url);
                fixURIs(parent, "audio", "src", url);
                fixURIs(parent, "a", "href", url);

                cb(null, {
                    html: content.html(),
                    type: CONFIG.T.safe_html,
                    rel: [CONFIG.R.reader, CONFIG.R.instapaper]
                });
            } else {
                cb();
            }
        });
    }

    // TODO: add tests.

};