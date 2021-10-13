export default {

    re: /^https:\/\/yandex\.ru\/maps\/-\//,

    mixins: [
        "*"
    ],

    getLink: function(url) {
        return {
            href: url.replace(/\/maps\/-\//, '/map-widget/v1/-/'),
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.app, CONFIG.R.html5],
            "aspect-ratio": 4/3
        };
    },

    tests: [
        "https://yandex.ru/maps/-/CWS~5QYp"
    ]
};