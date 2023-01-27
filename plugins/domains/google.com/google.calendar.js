export default {

    re: [
        /https?:\/\/(?:www|calendar)\.google\.com\/calendar\/(?:u\/\d+\/)?embed\/?\?([^\/]+)/i
    ],

    mixins: ['*'],

    getLink: function(urlMatch) {
        return {
            href: 'https://www.google.com/calendar/embed?' + urlMatch[1] + '&via=iframely',
            type: CONFIG.T.text_html,
            rel: CONFIG.R.reader,
            "aspect-ratio": 800 / 600
        }
    },

    tests: [{
        noFeeds: true
    },
        'https://calendar.google.com/calendar/embed?src=92600p5mb857b0t0jq0f6l8vpg%40group.calendar.google.com&ctz=America/Toronto',
        'https://calendar.google.com/calendar/u/0/embed?src=92600p5mb857b0t0jq0f6l8vpg%40group.calendar.google.com&ctz=America/Toronto'
    ]
};    