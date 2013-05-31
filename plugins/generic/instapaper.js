var $ = require('jquery');
var jsdom = require('jsdom');

module.exports = {

    getLink: function(instapaper_flag, html, cb) {

        jsdom.env({
            html: html
        }, function(err, window) {

            if (err) {
                return cb(err);
            }

            var $selector = $.create(window);

            var $cont = $('<article />');

            var content = $selector('.instapaper_body');

            content.find('.instapaper_ignore').remove();
            content.find('a[href=], a:not([href])').remove();

            if (content.length) {

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