module.exports = {

    re: /^http:\/\/v\.ku6\.com\/show\/([a-z0-9\._-]+)\.html/i,

    mixins: [
        "favicon",
        "canonical",
        "description",
        "keywords",
        "meta-title"
    ],

    getLink: function(urlMatch) {
        return {
            href: 'http://player.ku6.com/refer/' + urlMatch[1] + '/v.swf',
            type: CONFIG.T.flash,
            rel: [CONFIG.R.player, CONFIG.R.autoplay],
            'aspect-ratio': 1.2
        };
    },

    tests: [{
        page: 'http://www.ku6.com/',
        selector: '.l_vlist .ckl_a'
    },
        "http://v.ku6.com/show/igXYIuwqHCPANcvrwFd63A...html?hpsrc=1_28_1_1_0",
        "http://v.ku6.com/show/E70nubAr4nj5oh7fQK_vMQ...html?hpsrc=1_28_1_2_0"
    ]

};