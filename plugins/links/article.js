module.exports = {

	notPlugin:  !(CONFIG.providerOptions.readability && CONFIG.providerOptions.readability.enabled === true),
	provides: 'readability_flag',

    getLink: function(readability) {
        return {
            html: readability.getHTML(),
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.reader, CONFIG.R.inline]
        };
    },

    getData: function(meta) {

    	if (meta.og && meta.og.type === "article") {

	        return {
	            readability_flag: true
	        };
    	}
    },

    tests: [{
        page: "http://technorati.com/blogs/top100/",
        selector: ".latest"
    }]    
};