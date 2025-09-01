export default {

    re: /^https?:\/\/(?:magic|create)\.piktochart\.com\/output\/([\-a-zA-Z-0-9_]+)/i,

    mixins: [
        "*"
    ],    

    getLink: function(urlMatch) {
        return {

            template_context: {
                id: urlMatch[1]
            },
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.reader, CONFIG.R.ssl]
        };
    },

    tests: [
        "https://magic.piktochart.com/output/16505417-projet-immigration-copy",
        "https://magic.piktochart.com/output/14330224-descripciones-fisicas",

        "https://create.piktochart.com/output/38d889d24156-youtube-pitch-deck",
        "https://create.piktochart.com/output/04c845534560-buenas-practicas-en-la-elaboracion-de-alimentos-en-el-hogar"
    ]
};