export default {

    re: [
        /^https?:\/\/(?:www|\w{2})\.scribd\.com\/(doc|document|embeds|presentation|fullscreen)\/(\d+)/i
    ],

    mixins: [ "*", "query"],

    getLink: function(url, iframe, query, options) {
            var params = Object.assign(iframe.query);
            var hash = query.hash;

            var slideshow = options.getRequestOptions('scribd.slideshow', params.view_mode === 'slideshow');
            if (slideshow) {
                params.view_mode = 'slideshow';
            } else {
                delete params.view_mode;
            }

            var page = options.getRequestOptions('scribe.start_page', params.start_page || (hash && /page=(\d+)/i.test(hash) && hash.match(/page=(\d+)/)[1]) || 1);
            page = parseInt(page);

            if (page && typeof page === 'number' && page !== 1) {
                params.start_page = page;
            } else {
                page = 1; // re-write broken input
                delete params.start_page;
            }

            return {
                href: iframe.assignQuerystring(params),
                accept: CONFIG.T.text_html,
                rel: slideshow ? [CONFIG.R.player, CONFIG.R.slideshow, CONFIG.R.html5, CONFIG.R.oembed] : [CONFIG.R.reader, CONFIG.R.html5, CONFIG.R.oembed],
                'aspect-ratio': iframe['data-aspect-ratio'],
                'padding-bottom': 45, // toolbar
                options: {
                    slideshow: {
                        label: 'Show as slideshow',
                        value: slideshow
                    },
                    start_page: {
                        label: CONFIG.L.page,
                        value: page
                    }
                }

        }
    },

    getData: function(urlMatch, options, cb) {
        return 'embeds' === urlMatch[1]
            ? cb({redirect: `https://www.scribd.com/document/${urlMatch[2]}`})
            : cb(null, null);
    },

    tests: [{
        noFeeds: true
    },
        "https://www.scribd.com/doc/116154615/Australia-Council-Arts-Funding-Guide-2013",
        "https://www.scribd.com/document/399637688/Prestons-Advert"
    ]


};
