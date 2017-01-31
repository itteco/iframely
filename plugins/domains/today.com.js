// Have to skip Today's oEmbed as it doesn't seem reliable at the moment: 
// The first for specific URL to oEmbed returns seemingly random video
// Plus - videos randomly autoplay. And padding.

module.exports = {

    re: [
        /^https?:\/\/www\.today\.com\/video\/([^\/\?]+\d+)/i,
        /^https?:\/\/www\.today\.com\/video\/(today\/\d+)/i
    ],

    mixins: [
        "og-image",
        "favicon",
        "canonical",
        "dc",
        "twitter-description",
        "oembed-duration",
        "keywords",
        "og-site",
        "twitter-title"
    ],

    getLink: function(urlMatch, oembed) {

        // link to oEmbed here to make sure we do not match expired videos
        // ex.: http://www.today.com/video/cast-of-school-of-rock-perform-youre-in-the-band-545729603874

        return {
            href: "http://www.today.com/offsite/" + urlMatch[1],
            rel: [CONFIG.R.player, CONFIG.R.html5],
            type: CONFIG.T.text_html,
            'aspect-ratio': 16/9,
            'padding-bottom': 60,
            scrolling: 'no',
            'max-width': 1000
        };
    },

    tests: [
        "http://www.today.com/video/ted-cruz-explains-why-he-thinks-us-should-police-islamic-neighborhoods-650671171669",
        {
            skipMixins: ["oembed-duration"]
        }
    ]

};