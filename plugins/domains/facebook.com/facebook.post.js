module.exports = {

    re: /^https?:\/\/www\.facebook\.com\/.+/i,

    getLink: function(url, meta) {

        var title = meta["html-title"];
        title = title.replace(/ \| Facebook$/, "");

        return {
            title: title,
            type: CONFIG.T.text_html,
            rel: CONFIG.R.reader,
            template_context: {
                title: title,
                url: url
            },
            width: 552,
            height: 586
        }
    }
};