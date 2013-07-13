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

    re: /^https?:\/\/pinterest\.com\/((?!pin)[a-z0-9]+)\/?(?:$|\?|#)/i,

    getMeta: function() {
        return {
            title: "Pinterest User",
            site: "Pinterest"
        };
    },

    getLink: function(meta, url) {
        return {
            type: CONFIG.T.text_html,
            rel: CONFIG.R.reader,
            template: "pinterest.widget",
            template_context: {
                url: url,
                title: "Pinterest User",
                type: "embedUser",
                width: 800,
                height: 600,
                pinWidth: 120
            },
            width: 800,
            height: 600+120
        };
    },

    tests: [{
        page: "http://pinterest.com/all/science_nature/",
        selector: ".pinUserAttribution a.firstAttribution"
    },
        "http://pinterest.com/bcij/",
        "http://pinterest.com/franktofineart/"
    ]
};