export default {

    re: [
        /^https?:\/\/(?:www|calendar)\.google\.com\/calendar\/(?:u\/\d+\/)?embed\/?\?(?:.+)$/i
    ],

    mixins: ['*'],

    getLink: function(url) {
        return {
            href: url.replace(/\/u\/\d+\//, '/'),
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.iframely, CONFIG.R.reader],
            "aspect-ratio": 800 / 600
        }
    },

    tests: [{
        noFeeds: true
    },
        'https://calendar.google.com/calendar/embed?ctz=America/Toronto&src=92600p5mb857b0t0jq0f6l8vpg%40group.calendar.google.com',
        'https://calendar.google.com/calendar/u/0/embed?ctz=America/Toronto&src=92600p5mb857b0t0jq0f6l8vpg%40group.calendar.google.com'
    ]
};    