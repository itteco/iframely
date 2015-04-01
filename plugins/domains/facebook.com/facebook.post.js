var DEFAULT_WIDTH = 466;

module.exports = {

    re: [
        /^https?:\/\/(www|m)\.facebook\.com\/(photo|permalink|story|video)\.php\?[^\/]+(\d{10,})/i,
        /^https?:\/\/(www|m)\.facebook\.com\/([a-zA-Z0-9\.\-]+)\/(posts|activity)\/(\d{10,})/i,
        /^https?:\/\/(www|m)\.facebook\.com\/([a-zA-Z0-9\.\-]+)\/photos\/[a-zA-Z0-9\.\-]+\/(\d{10,})/i,
        /^https?:\/\/(www|m)\.facebook\.com\/notes\/([a-zA-Z0-9\.\-]+)\/[^\/]+\/(\d{10,})/i,
        /^https?:\/\/(www|m)\.facebook\.com\/media\/set\/\?set=[^\/]+(\d{10,})/i
    ],

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

    getLink: function(facebook_post, options) {
        return {
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.app, CONFIG.R.ssl, CONFIG.R.html5],
            template_context: {
                title: facebook_post.title,
                url: facebook_post.url,
                type: 'fb-post',
                width: options.maxWidth || DEFAULT_WIDTH
            },
            width: options.maxWidth || DEFAULT_WIDTH
        };
    },

    getData: function(url, meta, cb) {

        if (meta["html-title"] === "Facebook") {
            // the content is not public
            cb({responseStatusCode: 403});
        }        

        var title = meta["description"] ? meta["description"]: meta["html-title"].replace(/ \| Facebook$/, "");

        // Little hack for FB mobile URLs, as FB embeds don't recognize it's own mobile links.
        var redirect;
        if (url.indexOf("m.facebook.com/story.php") > -1) {
            redirect = url.replace("m.facebook.com/story.php", "www.facebook.com/permalink.php");
        }

        cb(null, {
            facebook_post: {
                title: title,
                url: redirect || url
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