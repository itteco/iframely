module.exports = {

    re: [
        /^https?:\/\/(?:tube|www)\.geogebra\.org\/(?:m|classic|graphing)\/(?:[a-zA-Z0-9]+)#material\/([a-zA-Z0-9#]+)/i,
        /^https?:\/\/(?:tube|www)\.geogebra\.org\/(?:m|classic|graphing)\/([a-zA-Z0-9]+)/i,
        /^https?:\/\/(?:tube|www)\.geogebra\.org\/student\/m([a-zA-Z0-9]+)/i,
        /^https?:\/\/(?:tube|www)\.geogebra\.org\/m\/([a-zA-Z0-9]+)/i
    ],

    mixins: [
        "*"
    ],

    // https://wiki.geogebra.org/en/Embedding_in_Webpages
    getData: function(urlMatch, options, cb) {
       if (!options.redirectsHistory|| options.redirectsHistory.indexOf('https://www.geogebra.org/m/' + urlMatch[1]) === -1) {
           cb (null, {__promoUri: {url: 'https://www.geogebra.org/material/iframe/id/' + urlMatch[1]} });
       } else {
           cb(null, null)
       }
    },

    tests: [{
        noFeeds: true
    }, {skipMethods: ['getData']},
        "http://tube.geogebra.org/m/60391",
        "http://www.geogebra.org/m/141300",
        "https://www.geogebra.org/m/wn2U6Hj6#material/ysf5TjUB",
        "https://www.geogebra.org/classic/hs52mgmq",
        "https://www.geogebra.org/graphing/pse7krdf"
    ]
};