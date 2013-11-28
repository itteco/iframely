module.exports = {

    re: [
        /^https?:\/\/pastebin\.com\/([a-zA-Z0-9]+)/i
    ],

    mixins: [
        "og-image",
        "favicon",
        "canonical",
        "og-site",
        "og-title"
    ],

    getLink: function (urlMatch) {

        return {
            href: "http://pastebin.com/embed_iframe.php?i="+ urlMatch[1],
            type: CONFIG.T.text_html,  // Will have scrollbars, true. However, JS embeds of PasteBin use document.write, and so do not work in async js apps
            rel: CONFIG.R.reader,
        }
    },

    tests: [{
        pageWithFeed: "http://pastebin.com/ZjTA1Q4Z"
    }]
};