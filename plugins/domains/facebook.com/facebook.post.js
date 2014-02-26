var _ = require('underscore');

module.exports = {

    re: /^https?:\/\/www\.facebook\.com\/(?!login\.php).+/i,

    provides: 'facebook_post',

    getMeta: function(facebook_post) {
        return {
            title: facebook_post.title
        };
    },

    getLink: function(facebook_post) {
        return {
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.reader, CONFIG.R.inline],
            template_context: {
                title: facebook_post.title,
                url: facebook_post.url
            },
            width: 552
        };
    },

    getData: function(url, meta) {

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
            return;
        }

        var title = meta["html-title"];
        title = title.replace(/ \| Facebook$/, "");

        return {
            facebook_post: {
                title: title,
                url: url
            }
        };
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