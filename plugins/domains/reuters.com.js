module.exports = {
  
    re: [
        /^https?:\/\/www\.reuters\.com\/video\/\d{4}\/\d{2}\/\d{2}\/[a-zA-Z0-9\-]+\?videoId=(\d+)/i
    ],

    mixins: [
        "favicon",
        "canonical",
        "description",
        "meta-title",
        "image_src",
        "keywords"
    ],

    getLink: function (urlMatch) {

        return {
            href: "http://www.reuters.com/assets/iframe/yovideo?videoId=" + urlMatch[1],            
            rel: [CONFIG.R.player, CONFIG.R.autoplay, CONFIG.R.html5],
            type: CONFIG.T.text_html,
            "aspect-ratio": 512/288
        }
    },

    tests: [
        "http://www.reuters.com/video/2014/01/10/russian-cossacks-patrol-sochi-prior-to-o?videoId=276394330"
    ]
};