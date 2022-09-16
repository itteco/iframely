export default {

    re: [
        /^https?:\/\/pastebin\.com\/(?!search)([a-zA-Z0-9]+)/i
    ],

    mixins: [
        "*"
    ],

    getLink: function (urlMatch, og) {

        // Do not process generic marketing web pages on Pastebin.com
        if (!/\- Pastebin.com$/.test(og.title)) {
            return;
        }

        return {
            html: `<script src="https://pastebin.com/embed_js/${urlMatch[1]}"></script>`,
            type: CONFIG.T.text_html,  
            rel: [CONFIG.R.reader, CONFIG.R.ssl]  // not inline
        }
    },

    tests: [
        "https://pastebin.com/ZjTA1Q4Z"
    ]
};