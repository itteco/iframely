export default {

    // #v-1467332342001 isn't passed by Dailymail URL shortener
    // dailymail.co.uk 301 redirects to dailymail.com, stripping the hash fragment
    re: [
        /^https:\/\/mol\.im\/a\/\d+(#v\-\d+)/i,
        /^https?:\/\/www\.dailymail\.co\.uk\/[^#]+(#v\-\d+)/i
    ],

    getLink: function(urlMatch, headers, cb) {
        if (headers.location) {
            return cb(headers.location 
                && !/#/.test(headers.location) 
                ? {
                    redirect: headers.location + urlMatch[1]
                } : null
            );
        } else {
            return cb();
        }
    },

    getData: function(options) {
        options.exposeStatusCode = true;
        options.followHTTPRedirect = false;
    },

    tests: [{skipMethods: ['getData', 'getLink']},
        "https://mol.im/a/9343193#v-4206468436429980814",
        "https://www.dailymail.co.uk/lifestyle/article-11847441/Watch-new-Duke-Edinburgh-introduces-Sophie-duchess-time.html#v-6755232965847660921",

        "https://mol.im/a/15740741#v-6420720503543215467", // getLinks error is expected - no social-share embedUrl, falls back to generic parsers
        "https://www.dailymail.co.uk/news/article-3556177/Was-MH17-shot-Ukrainian-fighter-jet-BBC-documentary-claims-Boeing-777-targeted-plane.html#v-8296301435444282732" // getLinks error is expected - no social-share embedUrl, falls back to generic parsers
    ]
};