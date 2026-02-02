export default {
    re: /^https?:\/\/imageshack\.com\/i\/\w+/i,

    mixins: [
        "og-image-rel-image",
        "*"
    ],

    tests: [{
        page: "https://imageshack.com/discover",
        selector: "a.hero"
    },
        "https://imageshack.com/i/eyn2zNjEj",
        "https://imageshack.com/i/p5PixlVVj",
        "https://imageshack.com/i/id44d071j",
        "https://imageshack.com/i/pbzPCsEij"
    ]
};