module.exports = {

    re: [
        /http:\/\/ec\.europa\.eu\/avservices\/(video|focus)/i
    ],

    mixins: [
        "favicon",
        "date",
        "keywords"
    ],

    provides: 'ec_data',

    getLinks: function(ec_data) {

        var links = [];

        links.push ({
            href: ec_data["image_src"],
            type: CONFIG.T.image,
            rel: CONFIG.R.thumbnail
        }); 

        if (ec_data["video_src"]) {

            links.push({
                href: ec_data["video_src"],
                rel: CONFIG.R.player,
                type: CONFIG.T.flash,
                "aspect-ratio": ec_data["video_width"] / ec_data["video_height"]
            })
        }

        if (ec_data["twitter:player"]) {

            links.push({
                href: ec_data["twitter:player"].replace("https://", "http://"),
                rel: [CONFIG.R.player, CONFIG.R.autoplay],
                type: CONFIG.T.text_html,
                "aspect-ratio": ec_data["twitter:player:width"] / ec_data["twitter:player:height"]
            })
        }

        return links;
    },

    getMeta: function(ec_data) {

        return {
            "title": ec_data.title,
            "description": ec_data.description            
        }
    },

    getData: function(cheerio) {

        var $meta = cheerio('.append-bottom meta');
        var $links = cheerio('.append-bottom link');
        var data = {};

        var i;  // Sorry folks, have to declare it here, otherwise JSLint would not compile it 
                // http://stackoverflow.com/questions/4646455/jslint-error-move-all-var-declarations-to-the-top-of-the-function        

        for (i = 0; i < $meta.length; i++) {
            var $el = cheerio($meta[i]);
            if ($el.attr('name')) {
                data[$el.attr('name')] = $el.attr('content') || $el.attr('value');
            }
        }

        for (i = 0; i < $links.length; i++) {
            var $el = cheerio($links[i]);
            data[$el.attr('rel')] = $el.attr('href');
        }

        return {
            ec_data: data
        };
    },


    tests: [
        "http://ec.europa.eu/avservices/video/player.cfm?sitelang=en&ref=I082398",
        "http://ec.europa.eu/avservices/focus/index.cfm?sitelang=en&focusid=351"
        ]
};