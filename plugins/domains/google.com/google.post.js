module.exports = {

    /*
    Docs at:
    https://developers.google.com/+/web/embedded-post/
    */

    provides: "__google_plus_enabled",

    re: [
        /^https:\/\/plus\.google\.com\/(\d+)\/posts\/(\w+)/i,
        /^https:\/\/plus\.google\.com\/u\/0\/(\d+)\/posts\/(\w+)/i,
        /^https:\/\/plus\.google\.com\/(\+[a-zA-Z0-9\-%]+)\/posts\/(\w+)/i, // e.g. https://plus.google.com/+UmarHansa/posts/2m8yF7aFonn, plus international domains
        /^https:\/\/plus\.google\.com\/u\/0\/(\+\w+)\/posts\/(\w+)/i
    ],


    mixins: [
        "html-title",
        "description",
        "favicon"
    ],


    getLink: function(url, __google_plus_enabled) {

        return {
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.app, CONFIG.R.inline, CONFIG.R.ssl],
            template_context: {
                uri: url
            },
            width: 440
        };

    },

    getData: function (cheerio) { 

        
        return ! cheerio('a[href*="communities/"]').length ? {
            __google_plus_enabled: true
        } : {
            message: "This a post within community. G+ doesn't let those to be embedded yet."
        }
        // G+ doesn't support community posts!
        // ex. https://plus.google.com/101947077689367869700/posts/2fdzVY9LoSw
    },    

    tests: [
        "https://plus.google.com/106601272932768187104/posts/iezWej2wQmw",
        "https://plus.google.com/+UmarHansa/posts/2m8yF7aFonn",
        "https://plus.google.com/u/0/106507463771539639056/posts/1t7Ga54vkrw",
        "https://plus.google.com/110174288943220639247/posts/cfjDgZ7zK8o",
        {
            skipMixins: ["description"]
        }
    ]
};