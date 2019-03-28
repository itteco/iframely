module.exports = {

    re: [
        /^https?:\/\/quizlet\.com\/(?:\w{2}\/)?(\d+)\/([\w-]+)\/?/i
    ],

    mixins: [
        "*"
    ],

    getLinks: function(urlMatch, options) {

        var mode = options.getRequestOptions('quizlet.mode', /^flashcards|match|learn|spell|test$/i.test(urlMatch[2]) ? urlMatch[2] : 'flashcards');

        return {
            href: 'https://quizlet.com/' + urlMatch[1]+ '/' + mode + '/embed',
            accept: CONFIG.T.text_html,
            rel: [CONFIG.R.survey, CONFIG.R.html5],
            height: 500,
            options: {
                mode: {
                    value: mode,
                    label: "Mode",
                    values: {
                        match: 'Match',
                        learn: 'Learn',
                        test: 'Test',
                        flashcards: 'Flashcards',
                        spell: 'Spell'
                    }
                }
            }
        }

    },

    tests: [{
        page: 'https://quizlet.com/subject/math/?sortBy=mostRecent',
        selector: '.SetPreviewLink .UILinkBox-link .UILink'
    },
        "http://quizlet.com/43729824/conceptual-physics-final-review-part-1-flash-cards/",
        "https://quizlet.com/74274924/flashcards",
        "https://quizlet.com/141059966/learn",
        "https://quizlet.com/43729824/scatter",
        "https://quizlet.com/43729824/gravity",
        "https://quizlet.com/43729824/test",
        "https://quizlet.com/ca/385594556/math-flash-cards/"
    ]

};