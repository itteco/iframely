var DEFAULT_WIDTH = 550;

module.exports = {
    re: [
        /^https?:\/\/(www|m)\.facebook\.com\/([a-zA-Z0-9\.\-]+)\/?(?:\?f?ref=\w+)?$/i
    ],

    getLink: function(meta, oembed, options) {

        console.log('i was here');

        // skip user profiles - they can not be embedded
        if (meta.al && meta.al.android && meta.al.android.url && /\/profile\//.test(meta.al.android.url)) {
           return;
        }

        return {
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.app, CONFIG.R.ssl, CONFIG.R.html5, CONFIG.R.inline],
            html: oembed.html,                
            width: oembed.width
        };
    },

    tests: [
        "https://www.facebook.com/hlaskyjanalasaka?fref=nf",
        {
            noFeeds: true
        }
    ]
};