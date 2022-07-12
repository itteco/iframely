import * as URL from "url";

export default {

    re: /^https:\/\/yandex\.ru\/maps\//,

    mixins: [
        "*"
    ],

    getLink: function(url) {
        var urlObj = URL.parse(url, true);

        var ll = urlObj.query.ll;

        if (!ll || !ll.split) {
            return;
        }

        var lls = ll.split(',');
        if (lls.length !== 2) {
            return;
        }

        var longitude = lls[0];
        var latitude = lls[1];

        var zoom = urlObj.query.z;
        if (zoom && zoom.match(/^\d+$/)) {
            zoom = parseInt(zoom);
        } else {
            zoom = 7;
        }

        var aspect_ratio = 4/3;

        return {
            template_context: {
                latitude: latitude,
                longitude: longitude,
                zoom: zoom,
                aspect_ratio: aspect_ratio
            },
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.app, CONFIG.R.ssl],
            "aspect-ratio": aspect_ratio
        };
    },

    tests: [{
        noFeeds: true
    },
        "https://yandex.ru/maps/10738/lubercy/?ll=37.894794%2C55.685214&z=14",
        "https://yandex.ru/maps/?ll=36.997338%2C55.519264&z=14"
    ]

};