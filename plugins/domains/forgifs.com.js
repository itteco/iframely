module.exports = {

    re: /^https?:\/\/forgifs\.com\/gallery\/v\/\w+\/[\w-]+\.gif\.html/i,

    mixins: [
        "og-image-rel-image",
        "*"
    ],

    tests: [{
        pageWithFeed: "http://forgifs.com/gallery/main.php"
    },
        "http://forgifs.com/gallery/v/Cats/Cat-stuffed-animal-trolling.gif.html"
    ]
};