module.exports = {

    re: [
        /^https?:\/\/padlet\.com\/[0-9a-zA-Z_\-]+\/([0-9a-zA-Z_\-]+)/i
    ],

    mixins: [
        "*"
    ],

    getLink: function(urlMatch, meta) {

        if (meta.alternate && meta.alternate.length == 1 
            && meta.alternate[0].href && /^https:\/\/padlet\.com\/padlets\/[0-9a-zA-Z]+\/exports\/feed\.xml$/.test(meta.alternate[0].href)) {

            return {
                href: 'https://padlet.com/embed/' + (meta.alternate[0].href.match(/^https:\/\/padlet\.com\/padlets\/([0-9a-zA-Z]+)\/exports\/feed\.xml$/)[1]), //https://padlet.com/embed/g44u46on3u5n
                accept: CONFIG.T.text_html,
                rel: [CONFIG.R.app, CONFIG.R.html5],
                height: 608
            };
        }
    },

    tests: [
        "https://padlet.com/musiquerostand/musique_et_publicite",
        "https://padlet.com/ntourreau/gedjx0ek9idc",
        "https://padlet.com/angelique_stochmal/6x7j8v4yqrfp",
        "https://padlet.com/duffo_jonathan/rapaublues"
    ]
};