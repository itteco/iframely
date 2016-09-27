module.exports = {

    re: [
        /^https?:\/\/www\.qzzr\.com\/c\/quiz\/(\w+)\/[a-zA-Z0-9\-]+/i,
        /^https?:\/\/www\.boombox\.com\/c\/quiz\/(\w+)\/[a-zA-Z0-9\-]+/i,
        
    ],

    mixins: [
        "*"
    ],

    getLink: function(urlMatch) {
            
            return {
                template_context: {
                    id: urlMatch[1]
                },
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.survey, CONFIG.R.html5, CONFIG.R.ssl]
        }
    },

    tests: [
        "https://www.qzzr.com/c/quiz/256493/the-gary-quiz-af08b6ea-bd5c-42f3-9d84-40d099796636",
        "https://www.qzzr.com/c/quiz/253518/who-said-it-donald-trump-or-charlie-sheen-4eabba11-001f-4381-b27d-021b5fe0175c",
        "https://www.boombox.com/c/quiz/128123/97424d15-7e7e-4702-86c2-47961908cf58"
    ]
};