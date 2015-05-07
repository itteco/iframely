// Covers new google maps. Not classic ones. Classic ones are handled by maps.google.com.js plugin
// Docs are at https://developers.google.com/maps/documentation/embed/guide

module.exports = {

    notPlugin: !(CONFIG.providerOptions && CONFIG.providerOptions.google && CONFIG.providerOptions.google.maps_key),

    re: [
        // place 
        // https://www.google.com/maps/place/450+Serra+Mall,+Stanford+University,+Main+Quad,+Stanford,+CA+94305/@37.4278015,-122.1700577,17z/data=!3m1!4b1!4m2!3m1!1s0x808fbb2a0a120909:0xbdb15092feb97c41
        /^https?:\/\/(?:www\.)?google\.(?:com?\.)?[a-z]+\/maps\/(place)(?:\/preview)?\/([^\/\?]+)\/?(@[^\/]+)?/i,

        // directions
        // https://www.google.com/maps/dir/41.1744197,-73.0089647/Church+of+Christ,+2+Drew+Circle,+Trumbull,+CT+06611/@41.171124,-73.145653,12z/data=!3m1!4b1!4m9!4m8!1m0!1m5!1m1!1s0x89e80968e8b48d6f:0xf267c1e26968b542!2m2!1d-73.194478!2d41.251582!3e1?hl=en-US
        /^https?:\/\/(?:www\.)?google\.(?:com?\.)?[a-z]+\/maps\/(dir\/[^\/]+)\/([^\/\?]+)\/?(@[^\/]+)?/i,

        // search
        // https://www.google.com/maps/search/Brick%20House%20Cafe,%20Brannan%20Street,%20San%20Francisco,%20CA/@37.7577,-122.4376,12z
        /^https?:\/\/(?:www\.)?google\.(?:com?\.)?[a-z]+\/maps\/(search)\/([^\/\?]+)\/?(@[^\/]+)?/i,

        // view
        // https://www.google.com.br/maps/@-23.5812118,-46.6308331,13z?hl=pt-BR
        // https://www.google.com.br/maps/@-23.5812118,-46.6308331,7627m/data=!3m1!1e3?hl=pt-BR
        /^https?:\/\/(?:www\.)?google\.(?:com?\.)?[a-z]+\/(maps)\/()(@[^\/\?]+)/i, // empty search string as urlMatch[2]

        // street view
        // https://www.google.ca/maps/place/1+Wellington+St,+Ottawa,+ON+K1A+0A6/@45.425013,-75.695273,3a,75y,221.72h,76.43t/data=!3m5!1e1!3m3!1s5EpfU65PIZKcX26GbqBpVA!2e0!3e5!4m2!3m1!1s0x4cce04ff23c99f1d:0x4275051b90152635!6m1!1e1?hl=en
        // https://www.google.com.br/maps/@-23.584904,-46.609612,3a,75y,200h,90t/data=!3m5!1e1!3m3!1sxlw3YNvRpz05D-1ayD8Z2g!2e0!3e5?hl=pt-BR
        

        // https://www.google.co.kr/maps/place/132+Hawthorne+St,+San+Francisco,+CA+94107,+USA/@37.7841182,-122.3973147,15z/data=!4m2!3m1!1s0x8085807c23cc4ebb:0xd9372e1e753f6bc7

    ],

    provides: 'gmap',

    mixins: [
        "favicon" // Also used to make html parser verify that URL doesn't 404
    ],

    getMeta: function(gmap) {
        return {
            title: (gmap.q && decodeURIComponent(gmap.q).replace ('+', ' ').replace ('%20', ' ')) || gmap.center || "Google Maps"
        }
    },

    getLinks: function(gmap) {

        if (!gmap.mode) {
            return
        };

        if (gmap.mode == "directions" && !gmap.zoom ) {
            gmap.zoom = 12; // as a fallback only, to make sure directions never return an error
        }

        var map = "https://www.google.com/maps/embed/v1/" + gmap.mode + "?key=" + CONFIG.providerOptions.google.maps_key;

        if (gmap.q && gmap.mode != 'streetview') {
            map = map + (gmap.mode == "directions" ? "&destination=" : "&q=") + gmap.q;
        }

        if (gmap.origin) {
            map = map + "&origin=" +gmap.origin;
        }

        if (gmap.center && gmap.mode != 'streetview') {
            map = map + "&center=" +gmap.center;
        }

        if (gmap.elevation && gmap.elevation > 0) {
            map = map + "&maptype=satellite";

            //    elevation = 270 * 2 ^ (19-zoom) => 
            // => zoom = 19 - log2 (elevation / 270)

            if (!gmap.zoom) {
                var zoom = Math.floor(19 - Math.log(gmap.elevation / 270) / Math.LN2);
                gmap.zoom = zoom < 3 ? 3 : zoom > 19 ? 19 : zoom;
            }            

        }

        if (gmap.zoom) {
            map = map + "&zoom=" + gmap.zoom;
        }

        if (gmap.mode ===  "streetview" && gmap.location && gmap.heading ) { 
            map = map + "&location=" + gmap.location + "&heading=" + gmap.heading;
        }


        return [{
            href: map,
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.app, CONFIG.R.ssl, CONFIG.R.html5],
            "aspect-ratio": 600 / 450
        }, {
            href: "https://maps.googleapis.com/maps/api/staticmap?center=" + (gmap.center || gmap.q) + '&zoom=' + (gmap.zoom || 12) + '&size=400x400',
            type: CONFIG.T.image,
            rel: CONFIG.R.thumbnail,
            width: 400,
            height: 400
        }];
    },

    getData: function(url, urlMatch) {

        var gmap = {};

        // Detecting a mode
        var mode = urlMatch[1];

        var modeMap = {
            'place': 'place',
            'search': 'search',            
            'dir': 'directions',
            'maps': 'view'
        };

        if ((/^dir\//).test(mode)) { // directions have an extra folder in URL match
            gmap.mode =  modeMap['dir'];
            gmap.origin = mode.replace('dir/', '');

        } else {
            gmap.mode =  modeMap[mode];
        }

        // Search query is always returned by urlMatch, even if empty
        gmap.q = urlMatch[2];

        // Coordinates - if given: urlMatch[3]
        if (urlMatch.length > 3 && urlMatch[3]) {

            var coordinates = urlMatch[3].replace('@','').split(','); 
            // @-23.5812118,-46.6308331,7627m
            // @37.4278015,-122.1700577,17z

            if (coordinates.length > 1) {
                gmap.center = coordinates[0] + ',' + coordinates[1];
            }

            if (coordinates.length > 2) {

                var paramsMap = {
                    z: "zoom",
                    m: "elevation",
                    h: "heading"
                };

                var i;
                for (i = 2; i < coordinates.length; i++) {
                    var dw = coordinates[i].match(/([\d\.]+)(\w)/); 

                    if (dw && dw.length > 2 && paramsMap[dw[2]]) { // scrape only known params
                        gmap[paramsMap[dw[2]]] = dw[1];
                    }
                }
            }

            if (gmap.heading) {
                gmap.mode = "streetview";
                gmap.location = gmap.center;
            }
        }


        return {
            gmap : gmap
        };

    },

    tests: [{
            noFeeds: true
        },
        "https://www.google.com/maps/place/1%20Wellington%20St,%20Ottawa,%20ON%20K1A%200A6,%20Canada/@45.4250903,-75.6998334,17z/data=!3m1!4b1!4m2!3m1!1s0x4cce04ff23c99f1d:0x4275051b90152635"
    ]
};