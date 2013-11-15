module.exports = {

    re: [
        /^http:\/\/screencast\.com\/t\//i
    ],

    mixins: [
        "og-image",
        "description",
        "html-title"
    ],

    getLink: function($selector) {
        console.log('i was here');

        var $el = $selector('img.embeddedObject');
        var isImage = true;
        var result;
        
        if (!$el.length) {
            isImage = false;
            $el = $selector('#scPlayer')
        };

        if (isImage) 
    
            result = {
                href: $el.attr('src'),
                type: CONFIG.T.image,
                rel: CONFIG.R.image ,
                width: $el.attr('width'),
                height: $el.attr('height')
            }; 

        else {

            var flashVars = $selector('#scPlayer param[name="flashVars"]').attr('value');
            console.log(flashVars);
        
            result = {
                href: $el.attr('data') + '?thumb=' + flashVars.split('&thumb=')[1],
                type: $el.attr('type'),
                rel: CONFIG.R.player,
                "aspect-ratio": $el.attr('width') / $el.attr('height')
            }
        };

        return result;
    },

    tests: [ 
        "http://screencast.com/t/kg3Waazl1q",
        "http://screencast.com/t/t1sxDFYO",
        "http://screencast.com/t/pZ9CEcsnj75"
    ]
};
