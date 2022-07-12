export default {

    re: [
        /^https?:\/\/readymag\.com\/\w+\/(\d+)/i
    ],

    mixins: [
        "*"
    ],

    getLink: function(url, urlMatch) {

        return {
                html:   '<a class="rm-mag-embed" href="' + url + '" data-uri="' + urlMatch[1] + '"  data-width="responsive"  target="_blank"></a>' + 
                        '<script async src="https://readymag.com/specials/assets/embed_init.js" id="readymag-embed-init"></script>',
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.app, CONFIG.R.ssl], // not inline due to ID in script tag
                'aspect-ratio': 4/3
            };

    },

    tests: [
        "https://readymag.com/rbphotography/57005/"
    ]
};