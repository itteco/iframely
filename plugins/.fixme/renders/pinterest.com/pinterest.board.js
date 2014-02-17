/************************
 Pinterest is not parser-friendly and we would violate
 their Acceptable Use Policy at http://about.pinterest.com/use/
 if we are to provide a proper embed plugin to their domain
 and thus enable you to violate the same policy.

 We can't let your network be blacklisted with Pinterest
 per https://en.help.pinterest.com/entries/22914692

 If you notice that their policy changed and we had not updated this plugin yet,
 give us a shout and we'll tweak it promptly.
 *************************/

module.exports = {

    re: /^https?:\/\/(?:www\.)?pinterest\.com\/((?!pin)[a-z0-9]+)\/([\w\-]+)\/?(?:$|\?|#)/i,

    getMeta: function() {
        return {
            title: "Pinterest Board",
            site: "Pinterest"
        };
    },

    getLink: function(url) {
        return [{
            type: CONFIG.T.text_html,
            rel: CONFIG.R.reader,
            template: "pinterest.widget",
            template_context: {
                url: url,
                title: "Pinterest Board",
                type: "embedBoard",
                width: 800,
                height: 600,
                pinWidth: 120
            },
            width: 800,
            height: 600+120
        }];
    },

    tests: [

        // No Test Feed here not to violate "scrapping" restrictions of Pinterest
        
        "http://pinterest.com/bcij/art-mosaics/",
        "http://pinterest.com/bcij/aging-gracefully/"
    ]
};