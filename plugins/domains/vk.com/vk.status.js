var DEFAULT_WIDTH = 500;

module.exports = {

    re: [
        /^https?:\/\/(?:m\.)?vk\.com\/[a-z0-9_-]+\?w=wall([0-9-]+)_(\d+)/i,
        /^https?:\/\/(?:m\.)?vk\.com\/wall([0-9-]+)_(\d+)/i
    ],

    getLink: function(url, meta, urlMatch, options) {

        var m = url.match(/hash=([\w-]+)/i);

        var hash = (m && m[1]) || meta.embed_hash || meta.hash

        return {
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.app, CONFIG.R.ssl],
            template_context: {
                element_id: urlMatch[1],
                owner_id: urlMatch[2],
                width: options.maxWidth || DEFAULT_WIDTH,
                hash: hash
            },
            width: options.maxWidth || DEFAULT_WIDTH
        };
    },

    tests: [
        "http://m.vk.com/wall-6507719_32735?hash=FdsHbXcBqnCk3pJEr3WYxtexBU-9"
    ]

};