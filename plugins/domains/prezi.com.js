module.exports = {

    mixins: ["*"],

    getMeta: function(meta) {
        if (meta.ld && meta.ld.mediaobject) {
            return {
                author: meta.ld.mediaobject.author && meta.ld.mediaobject.author.name,
                author_url: meta.prezi_for_facebook && meta.prezi_for_facebook.author,
                date: meta.ld.mediaobject.datecreated
            }
        }
    },

    getLink: function(meta) {

        var player;

        if (meta.og && meta.og.video && meta.og.video.url) {
            player = meta.og.video.url;
        } else if (meta.ld && meta.ld.mediaobject && meta.ld.mediaobject.contenturl) {
            player = meta.ld.mediaobject.contenturl;
        }

        if (player && /^https?:\/\/prezi\.com\/bin\/preziloader\.swf\?prezi_id=([a-z0-9_-]+)/i.test(player)) {
            return {
                href: 'https://prezi.com/embed/' + player.match(/^https?:\/\/prezi\.com\/bin\/preziloader\.swf\?prezi_id=([a-z0-9_-]+)/i)[1] + '/',
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.html5],
                "aspect-ratio": 550 / 400
            }
        }
    },

    tests: [
        "http://prezi.com/hvsanqexuoza/designthinking-vs-leanstartup/",
        "https://prezi.com/penxp_esmqzu/e-learning-mooc-spoc-et-compagnie/"
    ]
};