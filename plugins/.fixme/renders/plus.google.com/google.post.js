module.exports = {

    /*
    Docs at:
    https://developers.google.com/+/web/embedded-post/
    */

    re: [
        /https:\/\/plus\.google\.com\/(\d+)\/posts\/(\w+)/i,
        /https:\/\/plus\.google\.com\/u\/0\/(\d+)\/posts\/(\w+)/i
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
                uri: url.replace("u/0/", "")
            },
            width: 440,
            height: 440
        };

    },

    tests: [
        "https://plus.google.com/106601272932768187104/posts/iezWej2wQmw",
        {
            skipMixins: ["description"]
        }
    ]
};