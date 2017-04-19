module.exports = {
    re: [
        /^https?:\/\/(www|m)\.facebook\.com\/([a-zA-Z0-9\.\-]+)\/?(?:\?f?ref=\w+)?$/i
    ],

    getMeta: function(oembed, urlMatch) {

        if (oembed.html) {

            var title = oembed.html.match(/>([^<>]+)<\/a><\/blockquote>/i);
            title = title ? title[1] : urlMatch[2];

            return {
                title: title
            };
        }
    },    

    getLink: function(oembed, meta, options) {

        // skip user profiles - they can not be embedded        
        if ((meta.al && meta.al.android && meta.al.android.url && /\/profile\//.test(meta.al.android.url)) || !/blockquote/.test(oembed.html)) {
           return;
        }        

        return {
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.app, CONFIG.R.ssl, CONFIG.R.html5],
            html: oembed.html,                
            "max-width": oembed.width
        };
    },

    tests: [
        "https://www.facebook.com/hlaskyjanalasaka?fref=nf",
        {
            noFeeds: true
        }
    ]
};