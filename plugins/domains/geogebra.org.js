export default {

    re: [
        /^https?:\/\/(?:www\.)?geogebra\.org\/(?:m|classic|graphing)\/(?:[a-zA-Z0-9]+)#material\/([a-zA-Z0-9#]+)/i,
        /^https?:\/\/(?:www\.)?geogebra\.org\/(?:m|classic|graphing)\/([a-zA-Z0-9]+)/i,
        /^https?:\/\/(?:www\.)?geogebra\.org\/student\/m([a-zA-Z0-9]+)/i,
        /^https?:\/\/(?:www\.)?geogebra\.org\/m\/([a-zA-Z0-9]+)/i
    ],

    mixins: [
        "*"
    ],

    getLink: function(urlMatch) {
        /** https://wiki.geogebra.org/en/Embedding_in_Webpages */

        if (!/^\d+$/.test(urlMatch[1])) {
            return {
                href: 'https://www.geogebra.org/material/iframe/id/' + urlMatch[1],
                accept: CONFIG.T.text_html,
                rel: [CONFIG.R.app, CONFIG.R.iframely],
                'aspect-ratio': 800 / 600
            }
        }
    },

    tests: [
        {noFeeds: true},
        {skipMethods: ['getData']},
        "https://www.geogebra.org/m/141300",
        "https://www.geogebra.org/classic/hs52mgmq",
        "https://www.geogebra.org/graphing/pse7krdf"
    ]
};