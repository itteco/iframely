module.exports = {

    re: /^https?:\/\/quizlet\.com\/(\d+)\/[\w-]+\//i,

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
            var rel = [CONFIG.R.survey];
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
        page: 'http://quizlet.com/subject/math/?sortBy=mostRecent',
        selector: '.SearchResult-link'
    },
        "http://quizlet.com/43729824/conceptual-physics-final-review-part-1-flash-cards/"
    ]

};