module.exports = {

    re: [
        /^https?:\/\/(www\.)?screencast\.com\/t\//i,
        /^https?:\/\/(www\.)?screencast\.com\/users\//i        
    ],

    mixins: [
        "*"
    ],

    getLink: function(cheerio) {

        var $el = cheerio('img.embeddedObject');
        var result;
        
        if ($el.length) {

            result = {
                href: $el.attr('src'),
                type: CONFIG.T.image,
                rel: CONFIG.R.image ,
                width: $el.attr('width'),
                height: $el.attr('height')
            }; 

        } else { // let's try iFrame

            $el = cheerio('iframe.embeddedObject');

            if ($el.length) {

                result = {
                    href: $el.attr('src').replace(/^http:/i, ''),
                    type: CONFIG.T.text_html,
                    rel: [CONFIG.R.player, CONFIG.R.html5],
                    "aspect-ratio": $el.attr('width') / $el.attr('height')
                }                
            
            } else { // OK, it's older Flash player then

                $el = cheerio('#scPlayer');

                if ($el.length) {
                    var flashVars = cheerio('#scPlayer param[name="flashVars"]').attr('value');

                    result = {
                        href: $el.attr('data') + '?'+ flashVars,
                        type: $el.attr('type'),
                        rel: CONFIG.R.player,
                        "aspect-ratio": $el.attr('width') / $el.attr('height')
                    }
                }
            }            
            
        }

        return result;
    },

    tests: [ 
        "http://screencast.com/t/kg3Waazl1q",       // image
        "http://screencast.com/t/t1sxDFYO",         // image
        "http://screencast.com/t/pZ9CEcsnj75",      // Flash
        "http://screencast.com/t/MjA4M2ViMT",       // iFrame
        "http://www.screencast.com/t/F8c0F6CLK3"    // iFrame
    ]
};
