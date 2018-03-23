var cheerio = require('cheerio');

module.exports = {

    re: [
        /^https?:\/\/(?:tvcast|tv)\.naver\.com\/v\/(\d+)/i
    ],

    mixins: ['*'],

    provides: 'naver_html',

    getData: function(urlMatch, meta, request, cb) {

        if (!meta.naver || !meta.naver.video || !meta.naver.video.id) {
            return cb (null);
        } else {

            request({            
                uri: "http://tvcast.naver.com/api/clipShareHtml?videoId=" + meta.naver.video.id,
                json: true,
                prepareResult: function(error, response, body, cb) {

                    if (error) {
                        return cb(error);
                    }
                    cb(null, {
                        naver_html: body[0] // they return an array
                    });
                }
            }, cb);
        }
    },

    getLink: function(naver_html) {

        var $container = cheerio('<div>');
        try{
            $container.html(naver_html);
        } catch(ex) {}

        var $iframe = $container.find('iframe');

        if ($iframe.length == 1) {

            return {
                href: $iframe.attr('src').replace(/isAutoPlay=true/, 'isAutoPlay=false').replace(/^http:\/\//, '//'),
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.html5],
                "aspect-ratio": $iframe.attr('height') && $iframe.attr('width') ? $iframe.attr('width') / $iframe.attr('height') : CONFIG.DEFAULT_ASPECT_RATIO
            };
        }        

    },

    getMeta: function(meta) {
        if (meta.naver && meta.naver.video) {
            return {
                duration: meta.naver.video.play_time,
                views: meta.naver.video.play_count
            }
        }
    },

    tests: [{
        noFeeds: true
    },        
        "http://tv.naver.com/v/2889469"
    ]
};