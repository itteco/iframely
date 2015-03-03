module.exports = {

    re: [
        /^https?:\/\/ow\.ly\/i\//i
    ],    

    mixins: [
        "html-title",
        "canonical",
        "keywords",

        "og-image-rel-image",
        "favicon"
    ],

    tests: [{
        page: "http://ow.ly/user/founderfuel?t=photo",
        selector: ".mediaItem a"
    },
        "http://ow.ly/i/1pREd",
        "http://ow.ly/i/1pjIO"
    ]

};