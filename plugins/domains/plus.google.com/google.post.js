module.exports = {

    /*
    Docs at:
    https://developers.google.com/+/web/embedded-post/
    */

    re: [
        /https:\/\/plus\.google\.com\/(\w+)\/posts\/(\w+)/i,
        /https:\/\/plus\.google\.com\/\+(\w+)\/posts\/(\w+)/i,
        /https:\/\/plus\.google\.com\/u\/(\w+)\/(\w+)\/posts\/(\w+)/i,
        /http:\/\/www\.google\.com\/url?(.*)q=https%3A%2F%2Fplus\.google\.com%2Fapp%2Fbasic%2Fstream%2F(\w+)(.*)/i
    ],

    mixins: [
        "html-title",
        "description",
        "favicon"
    ],

    getLink: function(url, meta) {

        var title = meta["html-title"];

        return {
            title: title,
            type: CONFIG.T.text_html,
            rel: CONFIG.R.reader,
            template_context: {
                title: title,
                uri: url
            },
            width: 440,
            height: 440
        };

    },

    tests: [
        "https://plus.google.com/110174288943220639247/posts/cfjDgZ7zK8o",
        "https://plus.google.com/+LarryPage/posts/MtVcQaAi684",
        "https://plus.google.com/u/0/106189723444098348646/posts/MtVcQaAi684",
        "http://www.google.com/url?sa=D&q=https%3A%2F%2Fplus.google.com%2Fapp%2Fbasic%2Fstream%2Fz12ptj0rxnfczztqq04cjldqhk2ffnwpzys0k%3Fcbp%3D1atsk37dadx58%26sview%3D27%26spath%3D%2Fapp%2Fbasic%2F%252BAdeOshineye%2Fposts",
        {
            page: "https://plus.google.com/+Blogger/posts",
            selector: ".ik",
            getUrl: function(url) {
                return url.replace('/+Blogger', '');
            }
        },
        {
            skipMixins: ["description"]
        }
    ]
};