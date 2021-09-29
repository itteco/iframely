module.exports = {

    // #v-1467332342001 isn't passed by Dailymail URL shortener
    re: /^https:\/\/mol\.im\/a\/\d+(#v\-\d+)/i,

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
    },

    tests: [{skipMethods: ['getData', 'getLink']},
        "https://mol.im/a/9343193#v-4206468436429980814"
    ]
};