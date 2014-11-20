module.exports = {

    re: [
        /^https?:\/\/screencast\.com\/t\//i
    ],

    mixins: [
        "og-image",
        "description",
        "html-title"
    ],

    getLink: function(cheerio) {

        var $el = cheerio('img.embeddedObject');
        var isImage = true;
        var result;
        
        if (!$el.length) {
            isImage = false;
            $el = cheerio('#scPlayer');
        }

        if (isImage) {
    
            result = {
                href: $el.attr('src'),
                type: CONFIG.T.image,
                rel: CONFIG.R.image ,
                width: $el.attr('width'),
                height: $el.attr('height')
            }; 

        } else {

            var flashVars = cheerio('#scPlayer param[name="flashVars"]').attr('value');
        
            result = {
                href: $el.attr('data') + '?'+ flashVars,
                type: $el.attr('type'),
                rel: CONFIG.R.player,
                "aspect-ratio": $el.attr('width') / $el.attr('height')
            }
        }

        return result;
    },

    tests: [ 
        "http://screencast.com/t/kg3Waazl1q",
        "http://screencast.com/t/t1sxDFYO",
        "http://screencast.com/t/pZ9CEcsnj75",
        "http://screencast.com/t/MjA4M2ViMT",
        {
            skipMixins: ['description']
        }
    ]
};
