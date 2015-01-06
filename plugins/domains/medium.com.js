module.exports = {

    re: /^https:\/\/medium\.com\/@?[\w-]+/i,

    mixins: [
        "og-image",
        "favicon",
        "canonical",
        "og-description",
        "og-site",
        "og-title"
    ],

    getLink: function(og, url) {

        if (og.type === 'profile' || og.type === 'medium-com:collection') {

            var t = 'profile';
            if (og.type === 'medium-com:collection') {
                t = 'collection';
            }

            return {
                html: '<script async src="https://static.medium.com/embed.js"></script><a class="m-' + t + '" href="' + url + '">' + og.title + '</a>',
                width: 400,
                rel: [CONFIG.R.app, CONFIG.R.inline, CONFIG.R.ssl],
                type: CONFIG.T.text_html
            };
        }

        if (og.type === 'article') {
            var id = url.split('/').splice(-1)[0];
            return {
                href: 'https://api.medium.com/embed?type=story&path=' + encodeURIComponent('/p/' + id),
                height: 333,
                rel: [CONFIG.R.summary, CONFIG.R.html5],
                type: CONFIG.T.text_html
            };
        }
    },

    tests: [{
        page: 'https://medium.com/top-100',
        selector: '.link--secondary'
    }, {
        page: 'https://medium.com/top-100',
        selector: '.block-title a'
    },
        "https://medium.com/@startswithabang",
        "https://medium.com/better-humans"
    ]
};