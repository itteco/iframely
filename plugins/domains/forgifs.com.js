module.exports = {

    re: /^https?:\/\/forgifs\.com\/gallery\/v\/\w+\/[\w-]+\.gif\.html/i,

    mixins: [
        "og-image-rel-image",
        "favicon",
        "canonical",
        "og-description",
        "keywords",
        "og-site",
        "og-title"
    ],

    tests: [{
        pageWithFeed: "http://forgifs.com/gallery/main.php"
    },
        "http://forgifs.com/gallery/v/Cats/Cat-stuffed-animal-trolling.gif.html"
    ]
};