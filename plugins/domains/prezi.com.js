export default {

    re: /^https:\/\/prezi\.com\/([a-z0-9\-_]+)\/[^\/]+\/(?:\?[^\/\?]+)?$/i,

    mixins: ["*"],

    getLink: function(urlMatch) {

        // There was a player check based on og video before:
        /*
        if (player && /^https?:\/\/prezi\.com\/bin\/preziloader\.swf\?prezi_id=([a-z0-9_-]+)/i.test(player)) {
        */

        // But there's no og:video any more. So let's hardcode - validators will catch 404 on the errors
        if (!/^(p|view|embed)$/i.test(urlMatch[1])) {
            return {
                href: `https://prezi.com/embed/${urlMatch[1]}/`,
                accept: CONFIG.T.text_html,
                rel: CONFIG.R.player,
                "aspect-ratio": 550 / 400
            }
        }
    },

    tests: [
        "https://prezi.com/hvsanqexuoza/designthinking-vs-leanstartup/",
        "https://prezi.com/penxp_esmqzu/e-learning-mooc-spoc-et-compagnie/",
        "https://prezi.com/inge-1qo_fm4/ideas-sobre-la-nueva-economia/"
    ]
};