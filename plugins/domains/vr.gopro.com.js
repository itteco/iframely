module.exports = {

    re: [
        /^https?:\/\/vr\.gopro\.com\/video\/([a-zA-Z0-9]+)/i
    ],

    mixins: [
        "*"
    ],

    getLink: function(urlMatch) {
        return {
            href: 'https://vr.gopro.com/video/i/' + urlMatch[1],            
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.player, CONFIG.R.html5],
            'aspect-ratio': 800 / 450
        };
    },

    tests: [
        "https://vr.gopro.com/video/8e4b71b0a0f6c16e951013e9dc148439"
    ]
};