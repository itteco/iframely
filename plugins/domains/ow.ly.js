module.exports = {

    re: [
        /^https?:\/\/ow\.ly\/i\//i
    ],    

    mixins: [
        "og-title",
        "canonical",
        "keywords",

        "og-image-rel-image",
        "favicon"
    ],

    tests: [{
        page: "http://ow.ly/user/founderfuel?t=photo",
        selector: "a.border"
    },
        "http://ow.ly/i/1pREd",
        "http://ow.ly/i/1pjIO"
    ]

};