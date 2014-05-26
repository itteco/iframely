module.exports = {
    re: /https?:\/\/imageshack\.com\/i\/\w+/i,

    mixins: [
        "og-image-rel-image",
        "favicon",
        "canonical",
        "copyright",
        "keywords",
        "og-site",
        "og-title"
    ],

    tests: [{
        page: "https://imageshack.com/discover",
        selector: "a.photo"
    },
        "https://imageshack.com/i/nqxzeoj",
        "https://imageshack.com/i/06dv0aj"
    ]
};