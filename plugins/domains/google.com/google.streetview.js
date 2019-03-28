// Covers Google Maps street view images only: 
// https://developers.google.com/maps/documentation/streetview/intro

module.exports = {

    re: [
        // place 
        // https://www.google.com/maps/place/450+Serra+Mall,+Stanford+University,+Main+Quad,+Stanford,+CA+94305/@37.4278015,-122.1700577,17z/data=!3m1!4b1!4m2!3m1!1s0x808fbb2a0a120909:0xbdb15092feb97c41
        /^https?:\/\/(?:www\.)?google\.(?:com?\.)?[a-z]+\/maps\/(?:preview\/)?(place)(?:\/preview)?\/([^\/\?@]+)\/?(@[^\/]+)?/i,


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


    getLinks: function(gmap, options) {

        if (gmap.mode !== 'streetview' || !gmap.location) {
            return;
        }

        var api_key = options.getProviderOptions('google.maps_key');
        var signature = options.getProviderOptions('google.maps_signature');

        if (!api_key) {
            return;
        }

        var img_src = 'https://maps.googleapis.com/maps/api/streetview?size=620x465&location=' + gmap.location + '&key=' + api_key + (signature ? '&signature=' + signature : '');
        
        if (gmap.heading ) { 
            img_src += "&heading=" + gmap.heading;
        }

        if (gmap.pitch) { 
            img_src += "&pitch=" + gmap.pitch;
        }

        if (gmap.fov) { 
            img_src += "&fov=" + gmap.fov;
        }



        return {
            href: img_src,
            type: CONFIG.T.image,
            rel: CONFIG.R.thumbnail
            // let's validate that Maps key has street view enabled
            // width: 620,
            // height: 465
        };
    }

};