module.exports = {

    re: [
        /^https?:\/\/pastebin\.com\/(?!search)([a-zA-Z0-9]+)/i
    ],

    mixins: [
        "og-image",
        "favicon",
        "canonical",
        "og-site",
        "og-title"
    ],

    getLink: function (urlMatch, og) {

        // Do not process generic marketing web pages on Pastebin.com
        if (!/\- Pastebin.com$/.test(og.title)) {
            return;
        }

        return {
            href: "//pastebin.com/embed_iframe.php?i="+ urlMatch[1],
            type: CONFIG.T.text_html,  // Will have scrollbars, true. However, JS embeds of PasteBin use document.write, and so do not work in async js apps
            rel: CONFIG.R.reader
        }
    },

    tests: [
        "http://pastebin.com/ZjTA1Q4Z"
    ]
};