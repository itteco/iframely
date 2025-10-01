import * as URL from "url";

export default {

    re: /^https:\/\/yandex\.(ru|com)\/maps\//,

    mixins: [
        // "*" // Captcha :\
    ],

    getLink: function(url, utils, options) {
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

        const layout = options.getRequestOptions(utils.getProviderName(url) + '.layout', 'landscape');

        return {
            template_context: {
                latitude: latitude,
                longitude: longitude,
                zoom: zoom,
                aspect_ratio: layout === 'landscape' ? aspect_ratio : (layout === 'square' ? 1 : 1 / aspect_ratio)
            },
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.app, CONFIG.R.map, CONFIG.R.ssl],
            "aspect-ratio": aspect_ratio
        };
    },

    tests: [{
        noFeeds: true
    },
        "https://yandex.ru/maps/10738/lubercy/?ll=37.894794%2C55.685214&z=14",
        "https://yandex.ru/maps/?ll=36.997338%2C55.519264&z=14",
        "https://yandex.com/maps/213/moscow/?ll=37.624027%2C55.753512&mode=search&poi%5Bpoint%5D=37.621584%2C55.753461&poi%5Buri%5D=ymapsbm1%3A%2F%2Forg%3Foid%3D10661349235&sctx=ZAAAAAgBEAAaKAoSCfFmDd5XtSVAEXmxMEROl0hAEhIJvTeGAODDUEARCOdTxyppQkAiBgABAgMEBSgKOABA3K0HSAFiR3JlYXJyPXNjaGVtZV9Mb2NhbC9HZW91cHBlci9BZHZlcnRzL1JlYXJyYW5nZUJ5QXVjdGlvbi9DYWNoZS9Ub3BMaW1pdD0zYkZyZWFycj1zY2hlbWVfTG9jYWwvR2VvdXBwZXIvQWR2ZXJ0cy9SZWFycmFuZ2VCeUF1Y3Rpb24vQ2FjaGUvRW5hYmxlZD0xagV3b3JsZJ0BzczMPaABAKgBAL0Bis6xfsIBEK%2FV%2BucDsLb2uASh5K7VxQSCAgdrcmVtbGluigIAkgIAmgIMZGVza3RvcC1tYXBz&sll=37.624027%2C55.753512&sspn=0.013025%2C0.006123&text=kremlin&utm_source=share&z=16"
    ]

};