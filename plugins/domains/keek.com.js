module.exports = {

    mixins: [
        "canonical",
        "og-site",
        "og-title",
        "og-image",
        "favicon"
    ],

    getMeta: function(meta) {

        return {
            duration: 36,  // ;D
            author: meta.og.description.replace(' via Keek.com', '')
        };
    },


    getLink: function(meta) {


        var keek_id = (meta.og.url || "").match(/https?:\/\/(?:www\.)?keek\.com\/!([a-z0-9]+)$/i)
        if (!keek_id) return;

        return [{
            href: "http://www.keek.com/embed/" + keek_id[1],
            type: CONFIG.T.text_html,
            rel: CONFIG.R.player,
            "aspect-ratio": 480 / 390
        }];
    },

    tests: [
        "http://www.keek.com/JesseWellens/keeks/ZFH3aab",
        "http://www.keek.com/!ZFH3aab"
    ]
};