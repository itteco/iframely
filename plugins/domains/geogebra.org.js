module.exports = {

    re: [
    	/^https?:\/\/(?:tube|www)\.geogebra\.org\/(?:m|classic|graphing)\/([a-zA-Z0-9]+)/i,
    	/^https?:\/\/(?:tube|www)\.geogebra\.org\/student\/m([a-zA-Z0-9]+)/i,    	
    	/^https?:\/\/(?:tube|www)\.geogebra\.org\/m\/([a-zA-Z0-9]+)/i    	
    ],

    mixins: [
        "*"
    ],

    // https://wiki.geogebra.org/en/Embedding_in_Webpages
    getData: function(url, urlMatch, options, cb) {

    	var m = /^https?:\/\/(?:tube|www)\.geogebra\.org\/(?:classic|graphing)\/([a-zA-Z0-9]+)/i.test(url) 
    		&& url.match(/^https?:\/\/(?:tube|www)\.geogebra\.org\/(?:classic|graphing)\/([a-zA-Z0-9]+)/i)[1];

    	if (m && (!options.redirectsHistory || options.redirectsHistory.indexOf('https://www.geogebra.org/m/' + m) === -1)) {
	        cb (null, {
	        	__promoUri: {url: 'https://www.geogebra.org/m/' + m} // this is to avoid 401 errors on redirects to /m/..
	        });
    	} else {
			cb (null, {__promoUri: {url: 'https://www.geogebra.org/material/iframe/id/' + urlMatch[1]} });
		}
    },

    tests: [{
		noFeeds: true
	}, {skipMethods: ['getData']},
        "http://tube.geogebra.org/m/60391",
        "http://www.geogebra.org/m/141300",
        "https://www.geogebra.org/classic/hs52mgmq",
        "https://www.geogebra.org/graphing/pse7krdf"
    ]
};