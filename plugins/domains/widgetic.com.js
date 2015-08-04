module.exports = {

	re: /https?:\/\/widgetic\.com\/widgets\//i,

	// Use only mixins that depend on oembed, as otherwise htmlparser will 403
    mixins: [
    	"oembed-video-responsive",
    	"oembed-title",
    	"oembed-site",
    	"oembed-thumbnail"
    ],

    getLink: function (urlMatch, cb) {
        cb(null, {
            href: "https://widgetic.com/favicon.ico",
            type: CONFIG.T.image_icon,
            rel: CONFIG.R.icon
        });
    },    

    tests: [ 
        "https://widgetic.com/widgets/photo/before-after-gallery/composition/53513cf709c7e2cc778b4567/",
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