module.exports = {

    re: /http:\/\/www\.collegehumor\.com\/picture\.*/,

    mixins: [
        "og-title",
        "og-description",
        "og-site",
        "canonical",
        "date",
        "keywords",

        "favicon",
        "twitter-image-rel-image"
    ],

    tests: [{
        pageWithFeed: "http://www.collegehumor.com/pictures"
    },
        "http://www.collegehumor.com/picture/6785079/cops-pull-over-black-man"
    ]
};