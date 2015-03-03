module.exports = {

    re: [
        /^http:\/\/slide\.ly\/(gallery)\/view\/(\w+)/i,
        /^http:\/\/slide\.ly\/view\/(\w+)/i
    ],

    mixins: [
        "og-image",
        "og-description",
        "og-site",
        "favicon",
        "canonical",
        "keywords"
    ],

    getMeta: function(og) {
        return {
            title: og.title.split(' | ')[0]
        };
    },

    getLink: function(urlMatch) {
        if (urlMatch[1] === 'gallery') {
            return {
                href: '//slide.ly/gallery/embed/' + urlMatch[2] + '/audio/0',
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.ssl, CONFIG.R.html5]
            };
        } else {
            return {
                href: '//slide.ly/embed/' + urlMatch[1] + '/autoplay/0',
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.ssl, CONFIG.R.html5],
                'aspect-ratio': 16/9
            };
        }
    },

    tests: [
        "http://slide.ly/gallery/view/6359c7f383e4c0f63ecab96e9b5fbd06",
        "http://slide.ly/view/57763b5aa9947c8d947331ca01a8c82e"
    ]
};