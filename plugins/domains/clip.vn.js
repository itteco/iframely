module.exports = {

    re: /^http:\/\/clip\.vn\/watch\/(?:[\w-]+,)?([\w-]+)\/?/i,

    mixins: ["*"],

    getLink: function(urlMatch) {
        return [{
            href: 'http://clip.vn/favicon.ico',
            type: CONFIG.T.image_icon,
            rel: CONFIG.R.icon
        }, {
            href: 'http://clip.vn/embed/' + urlMatch[1],
            type: CONFIG.T.text_html,
            rel: CONFIG.R.player,
            'aspect-ratio': 640/389
        }];
    },

    tests: [{
        pageWithFeed: "http://clip.vn/"
    },
        "http://clip.vn/watch/Mot-ngay-truc-chien-cung-tiep-suc-mua-thi-2014,28mJ/"
    ]
};