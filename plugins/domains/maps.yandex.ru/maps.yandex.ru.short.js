export default {

    re: /^https:\/\/yandex\.(ru|com)\/maps\/-\//,

    mixins: [
        // "*" //Captcha :\
    ],

    getLink: function(url) {
        return {
            href: url.replace(/\/maps\/-\//, '/map-widget/v1/-/'),
            type: CONFIG.T.text_html,
            rel: CONFIG.R.app,
            "aspect-ratio": 4/3
        };
    },

    tests: [
        "https://yandex.ru/maps/-/CWS~5QYp",
        "https://yandex.com/maps/-/CLu~B4po"
    ]
};