module.exports = {

    re: [
        /^https?:\/\/www\.liveleak\.com\/view\?i=([_a-zA-Z0-9]+)/i,
        /^https?:\/\/(?:www\.)?liveleak\.com\/view\?(?:[^&]+&)*i=([_a-zA-Z0-9]+)/i
    ],

    mixins: [
        "canonical",
        "og-title",
        "og-description",
        "og-image",
        "favicon"
    ],

    getLink: function (og) {

        // http://edge.liveleak.com/80281E/u/u/thumbs/2013/Jun/4/5d54790ff19a_sf_12.jpg
        // For embedded videos (youtube) - 
        // http://edge.liveleak.com/80281E/s/s/17/media17/2014/Jan/13/e477ff3a60ae_embed_thumbnail_... 
        // So we can tell that if og:image contains "embed" - then it's not a hosted video
        if (!og.image || og.image.indexOf ("embed") > -1) {
            return;
        }

        var image_str = og.image.split('/');
        var image_name = image_str[image_str.length-1];

        var video_href = image_name.split('_')[0];


        return {
            href: "http://www.liveleak.com/ll_embed?f=" + video_href,
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.player, CONFIG.R.html5],
            "aspect-ratio": 640 / 360 // as per their embed code
        };
    },

    tests: [{
        feed: "http://www.liveleak.com/rss?featured=1"
    }]
};