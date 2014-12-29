module.exports = {

    re: /^https?:\/\/visual\.ly\/[\u0000-\u0080]+/i,

    mixins: [
        "canonical",
        "description",
        "shortlink",
        "twitter-title"
    ],

    getLinks: function(meta) {

        var thumbnail = meta.og.image;
        var str = thumbnail.split('_');
        var ext = thumbnail.split('.');
        var original = str[0]+'_'+str[1]+'.' + ext[ext.length - 1];

        return [{
            href: thumbnail,
            type: CONFIG.T.image,
            rel: CONFIG.R.thumbnail,
            width: 250,
            height: 250
        }, {
            href: original,
            type: CONFIG.T.image,
            rel: CONFIG.R.image
        }, {
            href: "//visual.ly/favicon.ico",
            type: CONFIG.T.image,
            rel: CONFIG.R.icon
        }];
    },

    tests: [{
        noFeed: true,
        skipMixins: [
            "description"
        ]
    },
        "http://visual.ly/marketer%E2%80%99s-guide-pinterest-video",
        "http://visual.ly/causes",
        "http://visual.ly/spring-cleaning-improve-energy-efficiency"
    ]
};