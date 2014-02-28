module.exports = {

    re: /^https?:\/\/visual\.ly\/[\u0000-\u0080]+/i,

    mixins: [
        "canonical",
        "description",
        "shortlink",
        "dc-title"
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
        pageWithFeed: "http://visual.ly/"
    },
        "http://visual.ly/spring-cleaning-improve-energy-efficiency",
        {
            skipMixins: [
                "description"
            ]
        }
    ]
};