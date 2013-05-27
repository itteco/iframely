module.exports = {

    re: [
        /^http:\/\/www\.gogoyoko\.com\/song\/([0-9\-]+)/i
    ],

    mixins: [
        "image_src",
        "html-title"
    ],

    getLink: function(meta) {

        return {
            title: meta['html-title'],
            href: meta.video_src.replace('&autoPlaySong=1', ''),
            type: meta.video_type,
            rel: CONFIG.R.player,
            width: meta.video_width,
            height: meta.video_height
        };        
    },

    tests: [
        "http://www.gogoyoko.com/song/873990"
    ]
};