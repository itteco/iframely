var _ = require('underscore');

module.exports = {

    re: /^https?:\/\/www\.facebook\.com\/(?!login\.php).+/i,

    provides: 'facebook_post',

    mixins: [
        "favicon"
    ],    

    getMeta: function(facebook_post) {
        return {
            title: facebook_post.title,
            site: "Facebook"
        };
    },

    getLink: function(facebook_post) {
        return {
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.app, CONFIG.R.inline],
            template_context: {
                title: facebook_post.title,
                url: facebook_post.url
            },
            width: 552
        };
    },

    getData: function(url, meta, cb) {

        var badRe = [
            // From profile.
            /^https?:\/\/(?:(?:www|m)\.)?facebook\.com\/(?!photo)([^\/\?#]+)(?:\?|#|\/?$)/i,
            /^https?:\/\/www\.facebook\.com\/(?!photo)([^\/\?#]+)$/i,

            // From video.
            /^https?:\/\/www\.facebook\.com\/video\/video\.php.*[\?&]v=(\d{5,})(?:$|&)/i,
            /^https?:\/\/www\.facebook\.com\/photo\.php.*[\?&]v=(\d{5,})(?:$|&)/i,
            /^https?:\/\/www\.facebook\.com\/video\/video\.php\?v=(\d{5,})$/i
        ];

        var good = _.every(badRe, function(re) {
            return !url.match(re);
        });

        if (!good) {
            cb (null, null);
        }

        if (meta["html-title"] == "Facebook") {
            // the content is not public
            cb("private FB post at " + url);
        }

        var title = meta["description"] ? meta["description"]: meta["html-title"].replace(/ \| Facebook$/, "");

        cb(null, {
            facebook_post: {
                title: title,
                url: url
            }
        });
    },

    tests: [
        "https://www.facebook.com/noven.roman/posts/555607674475258",
        "https://www.facebook.com/logvynenko/posts/10151487164961783",
        "https://www.facebook.com/photo.php?fbid=530060777048531&set=a.215094428545169.62692.100001338405848&type=1",
        {
            noFeeds: true
        }
    ]
};