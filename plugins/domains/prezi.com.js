module.exports = {

    re: [
        /^https?:\/\/prezi\.com\/(?!embed)(?!bin)([a-z0-9_-]+)\/[a-z0-9_-]+/i,
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
        /**
        Here's the original embed code: 
        <iframe src="http://prezi.com/embed/hvsanqexuoza/?
            bgcolor=ffffff
            &amp;lock_to_path=0
            &amp;autoplay=0
            &amp;autohide_ctrls=0
            &amp;features=undefined
            &amp;disabled_features=undefined" 
        width="550" height="400" frameBorder="0"></iframe>
        */

        return {
            href: 'http://prezi.com/embed/' + urlMatch[1] + '/?bgcolor=ffffff&amp;lock_to_path=0&amp;autoplay=0&amp;autohide_ctrls=0&amp;',
            type: CONFIG.T.text_html,
            rel: CONFIG.R.player,
            "aspect-ratio": 550 / 400
        }
    },

    tests: [
        "http://prezi.com/hvsanqexuoza/designthinking-vs-leanstartup/"
    ]
};