export default {

    re: [
        /^https?:\/\/ow\.ly\/i\//i
    ],    

    mixins: [
        "og-image-rel-image",
        "*"
    ],

    tests: [
        "http://ow.ly/i/2UEu0",
        "http://ow.ly/i/c1T0m",
        "http://ow.ly/i/c5Lrf",
        "http://ow.ly/i/1pREd",
        "http://ow.ly/i/1pjIO"
    ]
};