module.exports = {

    re: [
        /^https?:\/\/www\.t\-online\.de\/.+\/id_\d+\//i
    ],

    mixins: [
        "*"
    ],

    getLink: function(meta) {

        var href = (meta.video_src && meta.video_src.href) || meta.video_src;

        if (href && /\.mp4$/i.test(href)) {
        
            return {
                href: meta.video_src.href || meta.video_src,
                type: CONFIG.T.video_mp4,                
                rel: [CONFIG.R.player],
                "aspect-ratio": meta.video_width &&  meta.video_height ? (meta.video_width > meta.video_height ? meta.video_width / meta.video_height : meta.video_height / meta.video_width) : 16 / 9
            }
        }
    },

    tests: [
        "http://www.t-online.de/tv/stars/vip-spotlight/id_58647502/sexy-bilder-stars-im-bikini.html?vid=ap",
        "http://www.t-online.de/-/id_81361574/",
        "http://www.t-online.de/nachrichten/deutschland/militaer-verteidigung/id_81164408/bundeswehr-von-der-leyen-will-kasernen-umbenennen.html"
    ]
};