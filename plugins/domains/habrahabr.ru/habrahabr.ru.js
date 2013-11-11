module.exports = {


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

    getLink: function($selector) {

        var $html = $selector('div.content')

        if ($html.length) {

            var html = '';

            html += $html.html();

            return {
                html: html,
                type: CONFIG.T.safe_html,
                rel: [CONFIG.R.reader, CONFIG.R.inline]                
            };
        }
    },    

    tests: [
        "http://habrahabr.ru/sandbox/71772/",
        "http://habrahabr.ru/post/194130/"
    ]
};