export default {

    re: [
        /^https?:\/\/pastebin\.com\/(?!search)([a-zA-Z0-9]+)/i
    ],

    mixins: [
        "*"
    ],

    getLink: function (urlMatch, og) {

        // Do not process generic marketing web pages on Pastebin.com
        if (!/\- Pastebin.com$/.test(og.title)) {
            return;
        }

        return {
            href: "https://pastebin.com/embed_js/"+ urlMatch[1],
            type: CONFIG.T.javascript,  
            rel: [CONFIG.R.reader, CONFIG.R.html5, CONFIG.R.ssl]  // not inline
        }
    },

    tests: [
        "https://pastebin.com/ZjTA1Q4Z"
    ]
};