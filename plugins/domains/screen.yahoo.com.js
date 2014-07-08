module.exports = {
   
    re: [
        /^https?:\/\/screen\.yahoo\.com\/([\w\/\-]+\.html)/i
    ],

    mixins: [
        "og-image",
        "favicon",
        "canonical",
        "og-description",
        "site",
        "og-title"
    ],

    getLink: function (urlMatch) {

        return {
            href: "http://screen.yahoo.com/embed/"+ urlMatch[1],
            type: CONFIG.T.text_html,            
            rel: [CONFIG.R.player, CONFIG.R.html5],
            "aspect-ratio": 640/360
        }
    },

    tests: [
        "http://screen.yahoo.com/popular/car-driving-dog-causes-accident-225504529.html",
        "http://screen.yahoo.com/car-driving-dog-causes-accident-225504529.html"
    ]
};