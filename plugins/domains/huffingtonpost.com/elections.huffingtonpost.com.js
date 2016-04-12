var utils = require('../../../lib/utils');

module.exports = {

    re: [
        /^https?:\/\/elections\.huffingtonpost\.com\/pollster\/embed\/([^\/\?]+)/i,
        /^https?:\/\/elections\.huffingtonpost\.com\/pollster\/([^\/\?]+)/i
    ],    

    mixins: ["*"],

    getLink: function(urlMatch) {

        return {
            href: '//elections.huffingtonpost.com/pollster/embed/' + urlMatch[1] + '#!estimate=official',
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.app, CONFIG.R.html5],
            height: 400
        }

    },

    tests: [
        "http://elections.huffingtonpost.com/pollster/2016-florida-presidential-republican-primary",
        "http://elections.huffingtonpost.com/pollster/2016-national-gop-primary",
        "http://elections.huffingtonpost.com/pollster/2016-general-election-trump-vs-clinton",
        "http://elections.huffingtonpost.com/pollster/embed/donald-trump-favorable-rating"
    ]
};