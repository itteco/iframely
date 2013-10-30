module.exports = {

    re: [
        /http:\/\/ec\.europa\.eu\/avservices\/video/i
    ],

    mixins: [
        "favicon",
        "date",
        "keywords"
    ],

    getLinks: function(ec_data) {

        return [

        {
            href: ec_data["image_src"],
            type: CONFIG.T.image,
            rel: CONFIG.R.thumbnail
        },
        {
            href: ec_data["video_src"],
            rel: CONFIG.R.player,
            type: CONFIG.T.flash,
            "aspect-ratio": ec_data["video_width"] / ec_data["video_height"],
        }]
    },

    getMeta: function(ec_data) {

        return {
            "title": ec_data.title,
            "description": ec_data.description            
        }
    },

    getData: function($selector) {

        var $meta = $selector('.append-bottom meta');
        var $links = $selector('.append-bottom link');
        var data = {};


        var i;  // Sorry folks, have to declare it here, otherwise JSLint would not compile it 
                // http://stackoverflow.com/questions/4646455/jslint-error-move-all-var-declarations-to-the-top-of-the-function        

        for (i=0; i < $meta.length; i++) {
            if ($meta[i].name) {
                data[$meta[i].name]=$meta[i].content;
            }
        }

        for (i=0; i < $links.length; i++) {
            data[$links[i].rel]=$links[i].href;
        }

        return {
            ec_data: data
        }
    },


    tests: [
        "http://ec.europa.eu/avservices/video/player.cfm?sitelang=en&ref=I082398"
        ]
};