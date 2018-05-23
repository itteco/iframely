var utils = require('../../lib/utils');

module.exports = {

    re: [
    	/^https?:\/\/(?:tube|www)\.geogebra\.org\/material\/\w+\/id\/([a-zA-Z0-9]+)/i,
    	/^https?:\/\/(?:tube|www)\.geogebra\.org\/m\/([a-zA-Z0-9]+)/i,
    	/^https?:\/\/(?:tube|www)\.geogebra\.org\/student\/m([a-zA-Z0-9]+)/i,    	
    	/^https?:\/\/(?:tube|www)\.geogebra\.org\/m\/([a-zA-Z0-9]+)/i    	
    ],

    mixins: [
        "*"
    ],

    getLink: function(urlMatch, og, options, cb) {


    	if (!og.image) {
    		cb('OG image not available');    		
    	} else {

    		if (og.image.width && og.image.height) {

				cb (null, {
					href: 'https://tube.geogebra.org/material/iframe/id/' + urlMatch[1], 
					type: CONFIG.T.text_html,
					rel: [CONFIG.R.app, CONFIG.R.html5],
					"aspect-ratio": og.image.width / og.image.height
				}); 

    		} else {

		        utils.getImageMetadata(og.image, options, function(error, data) {

		            if (error || data.error) {
		                cb('Image not available');
		            } else {

				        if (data.width && data.height) {
				        	cb (null, {
					        	href: 'https://tube.geogebra.org/material/iframe/id/' + urlMatch[1], 
					        	type: CONFIG.T.text_html,
					        	rel: [CONFIG.R.app, CONFIG.R.html5],
					        	"aspect-ratio": data.width / data.height
				        	}); 
				        } else {
				        	cb ('Could not detect aspect ratio')
				        }
		            }
		        });
    		}

		}
    },


    tests: [{
		noFeeds: true
	},
        "http://tube.geogebra.org/m/60391",
        "http://www.geogebra.org/m/141300"
    ]
};