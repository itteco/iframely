module.exports = {

    re: /^https:\/\/medium\.com\/@?[\w-]+/i,

    mixins: [
        "*"
    ],

    getLinks: function(og, url) {

        if (og.type === 'profile' || og.type === 'medium-com:collection' || og.type === 'article') {

            var t = 'profile';
            if (og.type === 'medium-com:collection') {
                t = 'collection';
            } else if (og.type === 'article') {
                t = 'story';
            }

            return {
                html: '<script async src="https://static.medium.com/embed.js"></script><a class="m-' + t + '" href="' + url.replace('medium.com/s/','medium.com/') + '">' + og.title + '</a>',
                width: 400,
                rel: [og.type === 'article' ? CONFIG.R.summary : CONFIG.R.app, CONFIG.R.inline, CONFIG.R.ssl],
                type: CONFIG.T.text_html
            };
        }        
    },

    tests: [
        "https://medium.com/@startswithabang",
        "https://medium.com/hackerpreneur-magazine/nobody-s-heard-of-you-and-that-s-okay-82792dfecc12#.31za23rhx"
    ]
};