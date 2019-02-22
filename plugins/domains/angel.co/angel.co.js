module.exports = {

    re: /^https?:\/\/angel\.co\/(?!jobs)([a-zA-Z0-9\-]+)$/i,

    mixins: [
        "*"
    ],

    getLink: function(urlMatch, twitter) {

        var image = twitter.image.src || twitter.image;

        if (image && /\/(users|startups)\//.test(image)) {

            var id = image.match(/\/\w+\/(\d+)-/)[1];
            if (id === '6702' && urlMatch[1] !== 'angellist') {return;}
            
            return {
                template_context: {
                    title: twitter.title,
                    id: id,
                    type: image.match(/user/) || 'startup',
                    slug: urlMatch[1]
                },
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.summary, CONFIG.R.inline, CONFIG.R.ssl],
                "max-width": 560 + 40 + 10,
                "min-height": 300 + 40 + 10
            };
        }
    },

    tests: [
        "https://angel.co/iframely"
    ]
};