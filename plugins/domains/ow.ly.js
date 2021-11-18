export default {

    re: [
        /^https?:\/\/ow\.ly\/i\//i
    ],    

    mixins: [
        "og-image-rel-image",
        "*"
    ],

    tests: [{
        page: "http://ow.ly/user/founderfuel?t=photo",
        selector: ".mediaItem a"
    },
        "http://ow.ly/i/1pREd",
        "http://ow.ly/i/1pjIO"
    ]

};