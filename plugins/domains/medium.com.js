var re = /^https:\/\/medium\.com\/@?[\w-]+/i;

module.exports = {

    re: re,

    mixins: [
        "*"
    ],

    getLinks: function(og, url) {

        var links = [];

        if (og.type === 'profile' || og.type === 'medium-com:collection' || og.type === 'article') {

            var t = 'profile';
            if (og.type === 'medium-com:collection') {
                t = 'collection';
            } else if (og.type === 'article') {
                t = 'story';
            }

            links.push ({
                html: '<script async src="https://static.medium.com/embed.js"></script><a class="m-' + t + '" href="' + url + '">' + og.title + '</a>',
                width: 400,
                rel: [CONFIG.R.app, CONFIG.R.inline, CONFIG.R.ssl],
                type: CONFIG.T.text_html
            });
        }

        if (og.type === 'article') {
            var id = url.split('/').splice(-1)[0];
            links.push ({
                href: 'https://api.medium.com/embed?type=story&path=' + encodeURIComponent('/p/' + id),
                height: 333,
                rel: [CONFIG.R.summary, CONFIG.R.html5],
                type: CONFIG.T.text_html
            });
        }

        return links;
    },

    tests: [
        "https://medium.com/@startswithabang",
        "https://medium.com/hackerpreneur-magazine/nobody-s-heard-of-you-and-that-s-okay-82792dfecc12#.31za23rhx"
    ]
};