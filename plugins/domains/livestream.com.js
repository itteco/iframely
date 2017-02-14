module.exports = {

    re: [
        /^https?:\/\/livestream\.com\/\w+\/events\/(\d+)(?:[^\/])?$/,
        /^https?:\/\/livestream\.com\/accounts\/(\d+)\/events\/(\d+)\/player/,
        /^https?:\/\/livestream\.com\/\w+\/events\/(\d+)(?:[^\/])?$/,
        /^https?:\/\/livestream\.com\/\w+\/\w+\/?\?t=\d+$/
    ],    

    mixins: [
        "*"
    ],

    getLink: function (meta, urlMatch) {

        var event_id = urlMatch[2] ? urlMatch[2] : urlMatch[1];
        var account_id = urlMatch[2] ? urlMatch[1] : null;

        if (!account_id && meta['apple-itunes-app'] && /https?:\/\/livestream\.com\/accounts\/\d+\/events\/\d+\/?/i.test(meta['apple-itunes-app'])) {
            account_id = meta['apple-itunes-app'].match(/https?:\/\/livestream\.com\/accounts\/(\d+)\/events\/\d+/i)[1];
        }

        if (!event_id && meta['apple-itunes-app'] && /https?:\/\/livestream\.com\/accounts\/\d+\/events\/\d+\/?/i.test(meta['apple-itunes-app'])) {
            event_id = meta['apple-itunes-app'].match(/https?:\/\/livestream\.com\/accounts\/\d+\/events\/(\d+)/i)[1];
        }        

        if (event_id && account_id) {
            return {
                href: "https://livestream.com/accounts/" + account_id + "/events/" + event_id + "/player?autoPlay=false",
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.html5],
                "aspect-ratio": 16/9,
                autoplay: "autoPlay=true"
            }
        }

    },    

    tests: [
        "https://livestream.com/abeldanger/events/6926279",
        "https://livestream.com/sevierheights/maincampus?t=1486305168991",
        "https://livestream.com/accounts/2787677/events/6862936/player?width=0&height=0&enableInfoAndActivity=true&defaultDrawer=&autoPlay=true&mute=false"
    ]
};