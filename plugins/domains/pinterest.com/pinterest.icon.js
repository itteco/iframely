module.exports = {

    re: /^https?:\/\/pinterest\.com\//i,

    getLink: function() {
        return {
            href: "http://passets-ec.pinterest.com/webapp/app/desktop/images/favicon.7126dab5.png",
            type: CONFIG.T.image_png,
            rel: CONFIG.R.icon
        };
    },

    tests: [{
        noTest: true
    }]
};