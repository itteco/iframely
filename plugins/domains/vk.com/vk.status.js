module.exports = {

    re: [
        /^https?:\/\/vk\.com\/[a-z0-9_-]+\?w=wall([0-9-]+)_(\d+)/i,
        /^https?:\/\/vk\.com\/wall([0-9-]+)_(\d+)/i
    ],

    getLink: function(urlMatch) {
        var width = 500;
        return {
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.app, CONFIG.R.inline, CONFIG.R.ssl],
            template_context: {
                element_id: urlMatch[1],
                owner_id: urlMatch[2],
                width: width,
                hash: ''    // TODO: calucate hash
            },
            width: width
        };
    }

};