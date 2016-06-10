module.exports = {

    re: [
        /^https?:\/\/quizlet\.com\/(\d+)\/([\w-]+)\/?/i
    ],

    mixins: [
        "*"
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

        var bit ='flashcards';
        if (/^flashcards|learn|scatter|speller|test|spacerace|gravity$/i.test(urlMatch[2])) {
            bit = urlMatch[2];
        }

        return {
            href: 'https://quizlet.com/' + urlMatch[1]+ '/' + bit + '/embedv2',
            type: CONFIG.T.text_html,
            rel: CONFIG.R.survey,
            'min-width': 100,
            'min-height': 100
        }

    },

    tests: [{
        page: 'http://quizlet.com/subject/math/?sortBy=mostRecent',
        selector: '.SearchResult-link'
    },
        "http://quizlet.com/43729824/conceptual-physics-final-review-part-1-flash-cards/",
        "https://quizlet.com/74274924/flashcards",
        "https://quizlet.com/141059966/learn",
        "https://quizlet.com/43729824/scatter",
        "https://quizlet.com/43729824/gravity",
        "https://quizlet.com/43729824/test"
    ]

};