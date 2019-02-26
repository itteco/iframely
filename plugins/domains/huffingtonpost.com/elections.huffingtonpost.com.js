module.exports = {

    re: [
        /^https?:\/\/elections\.huffingtonpost\.com\/pollster\/(?:embed\/)?([-a-z0-9]+)(?:\/edit)?(.*)/i
    ],    

    mixins: ["*"],

    getLink: function(urlMatch) {

        return {
            href: '//elections.huffingtonpost.com/pollster/embed/' + urlMatch[1] + urlMatch[2],
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.app, CONFIG.R.html5, CONFIG.R.ssl],
            height: 500
        }

    },

    tests: [{
        noFeeds: true
    },
        "http://elections.huffingtonpost.com/pollster/2016-florida-presidential-republican-primary",
        "http://elections.huffingtonpost.com/pollster/2016-national-gop-primary",
        "http://elections.huffingtonpost.com/pollster/2016-general-election-trump-vs-clinton",
        "http://elections.huffingtonpost.com/pollster/embed/donald-trump-favorable-rating"
    ]
};
