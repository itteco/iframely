module.exports = {

    re: /^https:\/\/medium\.com\/@?([\w-]+)/i,

    mixins: [
        "og-image",
        "favicon",
        "canonical",
        "og-description",
        "og-site",
        "og-title"
    ],

    getLink: function(og, url) {

        if (og.type === 'profile' || og.type === 'medium:collection') {

            var t = 'profile';
            if (og.type === 'medium:collection') {
                t = 'collection';
            }

            return {
                html: '<script async src="https://static.medium.com/embed.js"></script><a class="m-' + t + '" href="' + url + '">' + og.title + '</a>',
                width: 400,
                rel: [CONFIG.R.app, CONFIG.R.inline],
                type: CONFIG.T.text_html
            };
        }
    },

    tests: [{
        page: 'https://medium.com/top-100',
        selector: 'a.avatar'
    },
        "https://medium.com/@startswithabang",
        "https://medium.com/better-humans"
    ]
};