module.exports = {

    re: [
        /^https:\/\/www\.indiegogo\.com\/projects\/([\w-]+)/i,
        /^https:\/\/life\.indiegogo\.com\/fundraisers\/([\w-]+)/i
    ],

    mixins: [
        "*"
    ],

    getLink: function(urlMatch) {
        return {
            href: 'https://www.indiegogo.com/project/' + urlMatch[1] + '/embedded',
            accept: CONFIG.T.text_html,
            rel: CONFIG.R.summary,
            width: 222,
            height: 445,
            scrolling: 'no'
        };
    },

    tests: [{
        pageWithFeed: 'https://www.indiegogo.com'
    },
        "https://www.indiegogo.com/projects/the-intel-80386-and-80486/"
    ]
};