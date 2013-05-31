module.exports = {

    re: /^https?:\/\/visual\.ly\/[\w\-]+/i,

    mixins: [
        "canonical",
        "description",
        "shortlink",
        "dc-title"
    ],

    getLinks: function(meta) {

        var thumbnail = meta.og.image;
        var str = thumbnail.split('_');
        var original = str[0]+'_'+str[1]+str[]

        return [{
            href: thumbnail,
            type: CONFIG.T.image_jpeg,
            rel: CONFIG.R.thumbnail,
            width: 250,
            height: 250
        }, {
            href: original,
            type: CONFIG.T.image,
            rel: CONFIG.R.image
        }];
    },

    tests: [{
        pageWithFeed: "http://visual.ly/"
    },
        "http://visual.ly/spring-cleaning-improve-energy-efficiency"
    ]
};