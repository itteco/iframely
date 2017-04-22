module.exports = {

    re: [
        /((https?:\/\/)?([w]+)?\.{1})?playbuzz\.com\/[\w]+\/[\w-]+/i
    ],

    mixins: [
        "*"
    ],

    provides: ['playbuzz'],

    getLink: function(urlMatch) {
        return [{
            html: '<script type="text/javascript" src="//cdn.playbuzz.com/widget/feed.js"></script><div class="pb_feed" data-embed-by="ecf87580-21f2-4673-966a-8e4354cc2452" data-game="' + urlMatch[0] + '" ></div>',
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.ssl, CONFIG.R.app],
            href: urlMatch[0]
        }]
    },

    getMeta: function() {
        return {
            site: 'Playbuzz'
        };
    },

    tests: [
        "https://www.playbuzz.com/philippeh10/tpmp-quel-est-votre-chroniqueur-pr-f-r"
    ]
};
