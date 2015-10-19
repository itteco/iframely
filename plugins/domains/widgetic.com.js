module.exports = {

	re: /https?:\/\/widgetic\.com\/widgets\//i,

	// Use only mixins that depend on oembed, as otherwise htmlparser will 403
    mixins: [
    	"oembed-rich",
    	"oembed-title",
    	"oembed-site",
    	"oembed-thumbnail",
        "domain-icon"
    ],

    tests: [         
        "https://widgetic.com/widgets/util/news-ticker/composition/5572e42d09c7e2227b8b456b/",
        {
            skipMixins: [
                "oembed-title",
                "oembed-site",
                "oembed-thumbnail"
            ]
        }        
    ]

};