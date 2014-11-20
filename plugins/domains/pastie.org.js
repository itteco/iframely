module.exports = {

    re: /http:\/\/pastie\.org\/(\d+)/i,

    getMeta: function(urlMatch) {
        return {
            title: '#' + urlMatch[1] + ' - Pastie'
        };
    },

    getLink: function(urlMatch) {
        return {
            href: "http://pastie.org/" + urlMatch[1] +".js",
            type: CONFIG.T.javascript, 
            rel: CONFIG.R.reader // not inline :\
        };
    },

    tests: [ 
        "http://pastie.org/807135"
    ]    

};