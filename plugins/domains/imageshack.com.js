module.exports = {
    re: /^https?:\/\/imageshack\.com\/i\/\w+/i,

    mixins: [
        "og-image-rel-image",
        "*"
    ],

    tests: [{
        page: "https://imageshack.com/discover",
        selector: "a.photo"
    },
        "http://imageshack.com/i/eyn2zNjEj"
    ]
};