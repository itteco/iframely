module.exports = {

	re: [
        /https?:\/\/widgetic\.com\/widgets\//i,
        /https?:\/\/app\.widgetic\.com\//i
    ],

	// Use only mixins that depend on oembed, as otherwise htmlparser will 403
    mixins: [
    	"oembed-rich",
    	"oembed-title",
    	"oembed-site",
    	"oembed-thumbnail",
        "domain-icon"
    ],

    tests: [{
        noFeeds: true
    }]

};