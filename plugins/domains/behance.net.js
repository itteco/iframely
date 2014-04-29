var jquery = require('jquery');

module.exports = {

    re: [
        /https?:\/\/www\.behance\.net\/gallery\/([a-zA-Z0-9\-\(\)]+)\/([0-9]+)/i,
        /https?:\/\/www\.behance\.net\/gallery\/([0-9]+)\/([a-zA-Z0-9\-\(\)]+)/i,
        /https?:\/\/([a-z-\.]+)\/gallery\/([a-zA-Z0-9\-\(\)]+)\/([0-9]+)/i,
    ],

    mixins: [
        "oembed-thumbnail",
        "favicon",
        "oembed-author",
        "oembed-canonical",
        "copyright",
        "og-description",
        "keywords",
        "oembed-site",
        "oembed-title"
    ],    

    getLink: function(oembed) {

        if (!oembed.provider_name == "Behance") return;

        var $container = jquery('<div>');
        try {
            $container.html(oembed.html);
        } catch (ex) {}

        var $iframe = $container.find('iframe');


        // if embed code contains <iframe>, return src
        if ($iframe.length == 1) {

            return {
                href: $iframe.attr('src'),
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.reader, CONFIG.R.oembed],
                "min-width": oembed.thumbnail_width,
                "min-height": oembed.thumbnail_height
            };
        }
    },

    tests: [
        "http://www.behance.net/gallery/ORBITAL-MECHANICS/10105739",
        "http://www.behance.net/gallery/TRIGGER/9939801",
        "http://www.behance.net/gallery/MEGA-CITIES/8406797",
        "http://portfolios.academyart.edu/gallery/ESCADA-Brand-Website/4706977",
        "http://portfolios.aiga.org/gallery/Bodega-Portraits/2752591",
        "http://portfolios.sva.edu/gallery/Threshold-Furniture-Design/720916",
        "http://portfolios.scad.edu/gallery/Privy-Boards-Graphic-Shirts/11126843",
        "http://portfolios.mica.edu/gallery/Bombora-Branding-Project-for-Surf-Company-(GD-HW)/12415809",
        "http://www.adccreativecrush.org/gallery/Veuve-Clicquot/5998331",
        "http://talent.adweek.com/gallery/ASTON-MARTIN-Piece-of-Art/3043295"
    ]

};