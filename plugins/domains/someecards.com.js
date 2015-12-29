module.exports = {

    mixins: [
        "*"
    ],

    getLink: function (og) {
        if (og.type === "someecards:card" && og.image) {
            return {
                href: og.image.url || og.image,
                type: CONFIG.T.image,
                rel: [CONFIG.R.image, CONFIG.R.og],
            };
        }
    },

    tests: [
        "http://www.someecards.com/usercards/viewcard/eea3c10dfaeb6ef8c6eb386707343c36",
        "http://www.someecards.com/christmas-cards/theres-nothing-like-holiday-cheer-to-offset-devastating-seasonal-affective-disorder"
    ]
};