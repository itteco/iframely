export default {

    mixins: [
        "*", "query"
    ],

    getLink: function (url, iframe, query, options) {

        var slide = options.getRequestOptions('speakerdeck.slide', query.slide ? parseInt(query.slide) || 1 : 1);

        if (iframe.src && iframe.width && iframe.height) {
            var href = iframe.src.replace(/^\/\//, 'https://');
            if (slide > 1) {
                href +=  href.indexOf('?') > -1 ? '&' : '?';
                href += 'slide=' + slide;
            }
            return {
                href: href,
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.html5],
                "aspect-ratio": iframe.width / iframe.height,
                options: {
                    slide: {
                        label: CONFIG.L.page,
                        value: slide
                    }
                }
            }
        }
    },


    tests: [
        "https://speakerdeck.com/gr2m/rails-girls-zurich-keynote?slide=3",
        "https://speakerdeck.com/lynnandtonic/art-the-web-and-tiny-ux"
    ]
};
