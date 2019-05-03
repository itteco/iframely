// Covers new google maps. Not classic ones. Classic ones are handled by maps.google.com.js plugin
// Docs are at https://developers.google.com/maps/documentation/embed/guide

module.exports = {

    re: [
        // place 
        // https://www.google.com/maps/place/450+Serra+Mall,+Stanford+University,+Main+Quad,+Stanford,+CA+94305/@37.4278015,-122.1700577,17z/data=!3m1!4b1!4m2!3m1!1s0x808fbb2a0a120909:0xbdb15092feb97c41
        /^https?:\/\/(?:www\.)?google\.(?:com?\.)?[a-z]+\/maps\/(?:preview\/)?(place)(?:\/preview)?\/([^\/\?@]+)\/?(@[^\/]+)?/i,

        // directions
        // https://www.google.com/maps/dir/41.1744197,-73.0089647/Church+of+Christ,+2+Drew+Circle,+Trumbull,+CT+06611/@41.171124,-73.145653,12z/data=!3m1!4b1!4m9!4m8!1m0!1m5!1m1!1s0x89e80968e8b48d6f:0xf267c1e26968b542!2m2!1d-73.194478!2d41.251582!3e1?hl=en-US

        // one waypoint:        https://www.google.co.in/maps/dir/Red+Fort,+Netaji+Subhash+Marg,+Chandni+Chowk,+New+Delhi,+Delhi/Fatehpuri,+New+Delhi,+Delhi/Delhi+Gate,+New+Delhi,+Delhi/@28.648602,77.214052,14z/data=!3m1!4b1!4m20!4m19!1m5!1m1!1s0x390cfce26ec085ef:0x441e32f4fa5002fb!2m2!1d77.2410203!2d28.6561592!1m5!1m1!1s0x390cfd12465a7def:0xc97043c5bb5c08ba!2m2!1d77.2214745!2d28.6563683!1m5!1m1!1s0x390cfcd8811f60ed:0x5c53287ad4d4f7e6!2m2!1d77.2417726!2d28.6405645!3e0?hl=en
        // multiple waypoints:  https://www.google.com/maps/dir/LOTAN+CHOLE+KULCHEY+WALA,+Govind+Ki+Gali,+Dariya+Ganj,+New+Delhi,+Delhi+110002,+India/Dr+Shroff+Charity+Eye+Hospital,+5027,+Kedarnath+Road,+Beside+Vani+Prakashan,+Daryaganj,+New+Delhi,+Delhi+110002,+India/SC-4B,+Basant+Rd,+Delhi+110055,+India/3113,+Sang+Trashan+Marg,+Kaseru+Walan,+Paharganj,+New+Delhi,+Delhi+110055,+India/@28.6426793,77.2198618,15z/data=!3m1!4b1!4m26!4m25!1m5!1m1!1s0x390cfcd91fe43afd:0xef6845b4da489dd1!2m2!1d77.2434193!2d28.6415535!1m5!1m1!1s0x390cfcdf9fb395bb:0x7d8962875ec3432e!2m2!1d77.2420112!2d28.645873!1m5!1m1!1s0x390cfd4744055f3f:0x6a3ea6a5a658cc3e!2m2!1d77.2164889!2d28.6394484!1m5!1m1!1s0x390cfd4193df763b:0xc93187db8d27b07e!2m2!1d77.21275!2d28.644072!3e2
        /^https?:\/\/(?:www\.)?google\.(?:com?\.)?[a-z]+\/maps\/(dir\/[^\/]+)\/([^@\?]+)\/(@[a-z0-9.,\-]+)/i,
        /^https?:\/\/(?:www\.)?google\.(?:com?\.)?[a-z]+\/maps\/(dir\/[^\/]+)\/([^\/\?]+)\/?(@[a-z0-9.,\-]+)?/i,
        // nagative long: https://www.google.com/maps/dir/Kamehameha+Hwy+%26+Waihee+Rd,+Kaneohe,+HI+96744/Ahilama+Rd+%26+Waihee+Rd,+Kaneohe,+HI+96744/@21.4587058,-157.8483868,16z/data=!3m1!4b1!4m13!4m12!1m5!1m1!1s0x7c006a09a5a1bc1d:0xddaf97be39fd785e!2m2!1d-157.8412339!2d21.4598091!1m5!1m1!1s0x7c006a06738821ef:0xc7df3f2795f71d2a!2m2!1d-157.846785!2d21.4576026


        // search
        // https://www.google.com/maps/search/Brick%20House%20Cafe,%20Brannan%20Street,%20San%20Francisco,%20CA/@37.7577,-122.4376,12z
        /^https?:\/\/(?:www\.)?google\.(?:com?\.)?[a-z]+\/maps\/(search)\/([^\/\?]+)\/?(@[^\/]+)?/i,
        /^https?:\/\/(?:www\.)?google\.(?:com?\.)?[a-z]+\/maps\/?\?(q)=([^&@\/\?]+)$/i,

        // view
        // https://www.google.com.br/maps/@-23.5812118,-46.6308331,13z?hl=pt-BR
        // https://www.google.com.br/maps/@-23.5812118,-46.6308331,7627m/data=!3m1!1e3?hl=pt-BR
        /^https?:\/\/(?:www\.)?google\.(?:com?\.)?[a-z]+\/(maps)\/()(@[^\/\?]+)/i, // empty search string as urlMatch[2]
        /^https?:\/\/(?:www\.)?google\.(?:com?\.)?[a-z]+\/(maps)\/place\/()(@[^\/\?]+)/i, // empty search string as urlMatch[2]

        // directions, but actually a view
        // https://www.google.nl/maps/dir/52.3389833,5.5608613//@52.3352336,5.5477077,15z
        /^https?:\/\/(?:www\.)?google\.(?:com?\.)?[a-z]+\/(maps)\/dir\/(?:[^\/]+)\/()\/(@[^\/\?]+)/i, // empty search string

        // street view
        // https://www.google.ca/maps/place/1+Wellington+St,+Ottawa,+ON+K1A+0A6/@45.425013,-75.695273,3a,75y,221.72h,76.43t/data=!3m5!1e1!3m3!1s5EpfU65PIZKcX26GbqBpVA!2e0!3e5!4m2!3m1!1s0x4cce04ff23c99f1d:0x4275051b90152635!6m1!1e1?hl=en
        // https://www.google.com.br/maps/@-23.584904,-46.609612,3a,75y,200h,90t/data=!3m5!1e1!3m3!1sxlw3YNvRpz05D-1ayD8Z2g!2e0!3e5?hl=pt-BR
        

        // https://www.google.co.kr/maps/place/132+Hawthorne+St,+San+Francisco,+CA+94107,+USA/@37.7841182,-122.3973147,15z/data=!4m2!3m1!1s0x8085807c23cc4ebb:0xd9372e1e753f6bc7

    ],

    provides: 'gmap',

    mixins: [
        "*",
    ],

    getMeta: function(gmap) {
        if (!/^place_id:/.test(gmap.q)) {
            return {
                title: (gmap.q && decodeURIComponent(gmap.q).replace (/\+/g, ' ').replace (/%20/g, ' ')) || gmap.center || "Google Maps",
                site: "Google Maps"
            }
        }
    },

    getLinks: function(gmap, options) {

        if (!gmap.mode) {
            return;
        }

        var api_key = options.getProviderOptions('google.maps_key');
        if (!api_key) {
            return;
        }

        var map = "https://www.google.com/maps/embed/v1/" + gmap.mode + "?key=" + api_key;

        if (gmap.q && gmap.mode != 'streetview') {
            map = map + (gmap.mode == "directions" ? "&destination=" : "&q=") + gmap.q + (gmap.waypoints ? '&waypoints=' + gmap.waypoints : '');
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

        if ((gmap.mode == "directions" || gmap.mode =='place') && !gmap.zoom ) {
            gmap.zoom = gmap.mode =='place' ? 17: 12; // as a fallback only, to make sure directions never return an error
        }        

        var zoom = Math.floor(gmap.zoom);

        if (gmap.zoom) {
            map = map + "&zoom=" + zoom;
        }

        if (gmap.mode ===  "streetview" && gmap.location && gmap.heading ) { 
            map = map + "&location=" + gmap.location + "&heading=" + gmap.heading;
        }

        var links = [{
            href: map,
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.app, CONFIG.R.ssl, CONFIG.R.html5],
            "aspect-ratio": eval(gmap.aspect.replace('x', '/')),
            options: {
                zoom: {
                    label: 'Zoom',
                    value: gmap.zoom,
                    range: {min: 3, max: 21} // avoid zoom < 3 for portrait to avoid grey areas
                },
                aspect: {
                    label: 'Map orientation',
                    value: gmap.aspect,
                    values: {
                        '600x450': 'Album',
                        '450x600': 'Portrait',
                        '600x600': 'Square'
                    }
                }
            }
        }] 

        if (!/^place_id:/.test(gmap.q)) {
            links.push({
                href: "https://maps.googleapis.com/maps/api/staticmap?center=" + (gmap.center || gmap.q) + '&zoom=' + (zoom || 12) + '&size=' + gmap.aspect + '&key=' + api_key,
                type: CONFIG.T.image,
                rel: CONFIG.R.thumbnail
                // width: 600, // make sure API is authorized to use static maps
                // height: 450
            });
        }

        return links;
    },

    getData: function(url, urlMatch, options, cb) {

        if (!options.getProviderOptions('google.maps_key')) {
            return cb ({
                responseStatusCode: 415,
                message: "Google requires your own key for Maps Embeds API. <a href='https://developers.google.com/maps/documentation/embed/guide#api_key' target='_blank'>Get one</a> and add it to the provider options."
            });
        }

        var gmap = {};

        // Detecting a mode
        var mode = urlMatch[1];

        var modeMap = {
            'place': 'place',
            'search': 'search',
            'q': 'search',           
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

        if (/^place_id:/.test(gmap.q)) {
            gmap.mode = 'place';
        }

        if (/\//i.test(gmap.q)) { // directions with waypoints, the last one is the destination
            var waypoints = gmap.q.split('/');
            gmap.q = waypoints[waypoints.length - 1];
            gmap.waypoints = '';
            for (i = 0; i < waypoints.length-1; i++) {
                gmap.waypoints += (i == 0 ? '' : '|') + waypoints[i];

            }            
        }

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
                    h: "heading",
                    t: "fov"
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

        gmap.aspect = options.getRequestOptions('gmap.aspect', '600x450');
        if (!/^\d+x\d+$/.test(gmap.aspect)) {gmap.aspect = '600x450';}
        gmap.zoom = parseInt(options.getRequestOptions('gmap.zoom', gmap.zoom));


        cb(null, {
            gmap : gmap
        });

    },

    tests: [{
            noFeeds: true
        },
        // "https://www.google.com/maps/place/1%20Wellington%20St,%20Ottawa,%20ON%20K1A%200A6,%20Canada/@45.4250903,-75.6998334,17z/data=!3m1!4b1!4m2!3m1!1s0x4cce04ff23c99f1d:0x4275051b90152635"
        // avoiding test URL here not to fail withiout Maps Key in config
    ]
};