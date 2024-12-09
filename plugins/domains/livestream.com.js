export default {

    re: [
        /^https?:\/\/livestream\.com\/(\w+)\/events\/(\d+)(\/videos?\/\d+)?/i,
        /^https?:\/\/livestream\.com\/accounts\/(\d+)\/events\/(\d+)(\/videos?\/\d+)?/i,
        /^https?:\/\/livestream\.com\/accounts\/(\d+)\/(\w+)(\/videos?\/\d+)?/i,
        /^https?:\/\/livestream\.com\/(\w+)\/events\/(\d+)(\/videos?\/\d+)?/i,
        /^https?:\/\/livestream\.com\/(\w+)\/(\w+)(\/videos?\/\d+)/i,
        /^https?:\/\/livestream\.com\/(\w+)\/(\w+)(?:\/?\?t=\d+)?$/i
    ],    

    mixins: [
        "*"
    ],

    getLink: function (meta, urlMatch) {

        var account_id = /^\d+$/.test(urlMatch[1]) ? urlMatch[1] : null;
        var event_id = /^\d+$/.test(urlMatch[2]) ? urlMatch[2] : null;
        var video_id = urlMatch[3] ? urlMatch[3] : '';

        if (!account_id && meta['apple-itunes-app'] && /https?:\/\/livestream\.com\/accounts\/\d+\/events\/\d+\/?/i.test(meta['apple-itunes-app'])) {
            account_id = meta['apple-itunes-app'].match(/https?:\/\/livestream\.com\/accounts\/(\d+)\/events\/\d+/i)[1];
        }

        if (!event_id && meta['apple-itunes-app'] && /https?:\/\/livestream\.com\/accounts\/\d+\/events\/\d+\/?/i.test(meta['apple-itunes-app'])) {
            event_id = meta['apple-itunes-app'].match(/https?:\/\/livestream\.com\/accounts\/\d+\/events\/(\d+)/i)[1];
        }        

        if (event_id && account_id) {
            return {
                href: "https://livestream.com/accounts/" + account_id + "/events/" + event_id + video_id + "/player?autoPlay=false",
                accept: CONFIG.T.text_html,
                rel: CONFIG.R.player,
                "aspect-ratio": 16/9,
                autoplay: "autoPlay=true"
            }
        }

    },    

    tests: [
        "https://livestream.com/accounts/11707815/events/4299357",
        "https://livestream.com/ironman/events/7777204/videos/163920520",
        "https://livestream.com/accounts/18968940/events/6670218/videos/145352362",
        "https://livestream.com/accounts/26021522/events/8730585/videos/214364915",
        "https://livestream.com/accounts/771055/live/videos/253665646"
    ]
};