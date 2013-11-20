module.exports = {

    // re: /^http:\/\/www\.eventbrite\.com\/event\/([0-9\-]+)/i,
    re: /^https?:\/\/(\w+)?\.(eventbrite)\.(com|ca|fr|it|jp|es|co\.uk)\//i,

    mixins: [
        "canonical",
        "og-title",
        "og-location",
        "og-description",
        "og-site",
        "og-image",
        "keywords",
        "favicon"
    ],

    getLinks: function(meta) {

        if (!meta.canonical || !meta.og || (meta.og && !meta.og.type == "eventbriteog:event")) return;

        var eventId = meta.canonical.match(/\d+$/); // Number at the end of the string

        if (eventId) {

            return {
                href: "//www.eventbrite.com/tickets-external?v=2&eid=" + eventId,
                type: CONFIG.T.text_html,
                rel: CONFIG.R.reader,
                "min-width": "500"
            };
        }
    },

    tests: [
        "http://womenshiftdigital.eventbrite.com",
        "http://egyptdemocracy.eventbrite.com/",
        "http://www.eventbrite.com/e/egypt-the-struggle-for-democracy-registration-9349712241?aff=estw",
        "https://www.eventbrite.co.uk/e/the-top-30-charity-ceos-on-social-media-launch-tickets-9069048769"
    ]
};