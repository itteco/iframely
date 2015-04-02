module.exports = {

    re: [
        /^https?:\/\/prezi\.com\/(?!embed)(?!bin)(?!press)([a-z0-9_-]+)\/[a-z0-9_-]+/i,
        /^https?:\/\/prezi\.com\/embed\/([a-z0-9_-]+)\//i,
        /^https?:\/\/prezi\.com\/bin\/preziloader\.swf\?prezi_id=([a-z0-9_-]+)/i
    ],

    mixins: [
        "canonical",
        "og-title",
        "og-description",
        "og-site",
        "og-image",
        "favicon"
    ],    

    getMeta: function(meta) {
        return {
            author_url: meta.prezi_for_facebook.author
        }
    },

    getLink: function(urlMatch) {

        return {
            href: 'https://prezi.com/embed/' + urlMatch[1] + '/',
            type: CONFIG.T.text_html,
            rel: CONFIG.R.player,
            "aspect-ratio": 550 / 400
        }
    },

    tests: [
        "http://prezi.com/hvsanqexuoza/designthinking-vs-leanstartup/"
    ]
};