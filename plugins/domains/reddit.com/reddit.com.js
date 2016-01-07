module.exports = {

    re: /^https?:\/\/(?:www|m\.)?reddit\.com\/r\/([^\/]+)\/comments\/([a-zA-Z0-9]+)\/([a-zA-Z0-9_]+)\/([a-zA-Z0-9]+)/i,

    mixins: [
        "*"
    ],

    getLink: function(urlMatch, twitter) {
            
        return {
            template_context: {
                url: 'https://reddit.com/r/' + urlMatch[1] + '/comments/' + urlMatch[2] + '/' + urlMatch[3] + '/' + urlMatch[4],
                thread_title: twitter.title || 'reddit thread',
                thread_url: 'https://reddit.com/r/' + urlMatch[1] + '/comments/' + urlMatch[2] + '/' + urlMatch[3],
                date: new Date ()
            },
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.app, CONFIG.R.inline, CONFIG.R.ssl]
        }
    },

    tests: [
        "https://www.reddit.com/r/photography/comments/3ub9mo/official_mega_thread_black_friday_cyber_monday/cxdtl7r"
    ]
};