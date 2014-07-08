module.exports = {

    re: /^http:\/\/quizlet\.com\/(\d+)\/[\w-]+\//i,

    mixins: [
        "og-image",
        "favicon",
        "canonical",
        "twitter-description",
        "twitter-title"
    ],

    getLinks: function(urlMatch) {
        var bits = [
            'flashcards',
            'learn',
            'scatter',
            'speller',
            'test',
            'spacerace'
        ];

        return bits.map(function(bit) {
            var rel = [CONFIG.R.app];
            if (bit === 'speller') {
                rel.push(CONFIG.R.autoplay);
            }
            return {
                href: 'https://quizlet.com/' + urlMatch[1]+ '/' + bit + '/embedv2',
                type: CONFIG.T.text_html,
                rel: rel,
                'min-width': 100,
                'min-height': 100
            }
        });
    },

    tests: [{
        page: 'http://quizlet.com/',
        selector: '.set[data-id] a'
    },
        "http://quizlet.com/43729824/conceptual-physics-final-review-part-1-flash-cards/"
    ]

};