module.exports = {

    // This is for articles only - players are covered by oembed auto-discovery
    re: [
        /^https?:\/\/sverigesradio\.se\/sida\/artikel\.aspx\?programid=\d+&artikel=(\d+)/i
    ],    

    mixins: [
        "*"
    ],

    getLink: function(urlMatch, request, cb) {

        request({
            uri: "http://sverigesradio.se/sida/playerajax/getaudiourl?id=" + urlMatch[1] + "&type=publication&quality=medium&format=iis",
            limit: 1, 
            timeout: 1000,
            prepareResult: function(error, response, body, cb) {

                // 404 means article is not embeddable
                if (error || response.statusCode !== 200) {
                    return cb(null);
                } else {

                    cb(null, {
                        href: 'https://sverigesradio.se/embed/publication/' + urlMatch[1],            
                        accept: CONFIG.T.text_html,
                        rel: [CONFIG.R.player, CONFIG.R.html5],
                        'min-width': 210,
                        height: 150
                    });
                }
            }
        }, cb);
    },

    tests: [
        "http://sverigesradio.se/sida/artikel.aspx?programid=406&artikel=5848335",
        "http://sverigesradio.se/sida/artikel.aspx?programid=2054&artikel=6573606"
        // not embeddable http://sverigesradio.se/sida/artikel.aspx?programid=2054&artikel=5728497
    ]
};