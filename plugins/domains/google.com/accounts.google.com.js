module.exports = {

    re: [
        /https?:\/\/accounts\.google\.com\/ServiceLogin/i,
        /https?:\/\/www\.google\.com\/accounts\/ServiceLogin/i,
        /https?:\/\/www\.google\.com\/(?:[\/a-z0-9-.]+)?\/ServiceLogin/i
    ],

    getLink: function(urlMatch, cb) {

        cb ({
            responseStatusCode: 403,
            message: "The page is private and requires a login."
        });
    }
};    