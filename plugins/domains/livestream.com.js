module.exports = {

    mixins: [
        "canonical",
        "og-title",
        "og-description",
        "og-site",
        "og-image",
        "favicon"
    ],

    getLink: function (meta) {
        if (meta.twitter && meta.twitter.player) 
            return {
                href: meta.twitter.player.value,
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.twitter],
                "aspect-ratio": meta.twitter.player.width / meta.twitter.player.height
            };

        else return {
            href: meta.video_src,
            type: meta.video_type || CONFIG.T.text_html,
            rel: CONFIG.R.player,
            width: meta.video_width,
            height: meta.video_height
        };
    },    

    tests: [ 
        "http://new.livestream.com/wbc2013/Melbourne2013/videos/19800974",
        "http://www.livestream.com/28thwcars/video?clipId=pla_641e42cf-6646-44ac-980f-1d0e96c79103&utm_source=lslibrary&utm_medium=ui-thumb",
        "http://www.livestream.com/28thwcars/",
        "http://twitcam.livestream.com/fll8j"
    ]
};