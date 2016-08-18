module.exports = {

    re: /http:\/\/v\.pptv\.com\/show\/\w+\.html/i,

    mixins: [
        "*"
    ],

    getLink: function(htmlparser, cb) {

        var end = false;

        var parser =  {
            // Parse <script> tag text in <body>.
            ontext: function(text) {
                if (end) {
                    return;
                }

                var m = text.match(/"swf":"(http:\\\/\\\/player\.pptv\.com\\\/v\\\/\w+\.swf)"/);
                if (m) {
                    end = true;

                    cb(null, {
                        href: m[1].replace(/\\\//g, '/'),
                        rel: [CONFIG.R.player, CONFIG.R.autoplay],
                        type: CONFIG.T.flash
                        //'aspect-ratio': 480 / 392 // use default aspect instead
                    });
                }
            },
            onerror: function(err) {
                if (end) {
                    return;
                }
                cb(err);
            },
            onend: function() {
                if (!end) {
                    cb();
                }
            }
        };

        htmlparser.addHandler(parser);
    },

    tests: [
        "http://v.pptv.com/show/jEWvLIAQ2hh7ibWE.html",
        "http://v.pptv.com/show/VBeBictBcltQ3tR0.html"
    ]
};