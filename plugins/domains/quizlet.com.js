export default {

    re: [
        /^https?:\/\/quizlet\.com\/(?:\w{2}\/)?(\d+)\/[^\/]+\/?/i,
        /^https?:\/\/quizlet\.com\/(?:\w{2}\/)?(?:flashcards|match|learn|spell|test)\/[^\/]+\-(\d+)\/?(?:\?.+)?$/i
    ],

    mixins: [
        "*"
    ],

    getLinks: function(url, urlMatch, options) {
        const TYPE_RE = /\/(flashcards|match|learn|spell|test)\//i;

        var mode = options.getRequestOptions('quizlet.mode', TYPE_RE.test(url) ? url.match(TYPE_RE)[1] : 'flashcards');

        return {
            href: 'https://quizlet.com/' + urlMatch[1]+ '/' + mode + '/embed',
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.survey, CONFIG.R.resizable],
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

    tests: [
        "https://quizlet.com/43729824/conceptual-physics-final-review-part-1-flash-cards/",
        "https://quizlet.com/74274924/flashcards",
        "https://quizlet.com/43729824/scatter",
        "https://quizlet.com/43729824/gravity",
        "https://quizlet.com/ca/385594556/math-flash-cards/",
        // "https://quizlet.com/test/conceptual-physics-final-review-part-1-43729824" redirect to login
        // "https://quizlet.com/141059966/learn" redirect to login
        // "https://quizlet.com/43729824/test" redirect to login
    ]
};