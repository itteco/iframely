module.exports = {

    notPlugin:  !(CONFIG.providerOptions.readability && CONFIG.providerOptions.readability.enabled === true),

    re: [
        /^http:\/\/habrahabr\.ru\/(post|sandbox)\/(\d+)/i
    ],

    // Ignoring company blogs - http://habrahabr.ru/company/ua-hosting/blog/200386/

    mixins: [
        "og-image",
        "favicon",
        "canonical",
        "og-description",
        "keywords",
        "html-title",        
        "og-title"
    ],

    getLink: function(cheerio) {

        var $html = cheerio('div.content')

        if ($html.length) {

            var html = '';

            html += $html.html();

            return {
                html: html,
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.reader, CONFIG.R.inline]                
            };
        }
    },    

    tests: [
        "http://habrahabr.ru/sandbox/71772/",
        "http://habrahabr.ru/post/194130/",
        {
            skipMixins: [ // Sandbox items don't have meta. Ant it's ok.
                "canonical",
                "og-description", 
                "keywords",
                "og-title",
                "og-image",
                "html-title"
            ]
        }
    ]
};