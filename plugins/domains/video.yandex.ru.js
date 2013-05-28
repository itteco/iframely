module.exports = {

    re: [
        /^https?:\/\/video\.yandex\.ru\/users\/[^\/]+\/view\/\d+\//i
    ],    

    mixins: [
        "oembed-title",
        "oembed-thumbnail",
        "oembed-author",
        "oembed-duration",
        "oembed-site",
        "oembed-description",        
        "oembed-video-responsive" //TODO: support https when parameters can be passed into mixins
    ],

    getLink: function() {

        return [{
            href: "//yandex.st/lego/_/Uk8wMlO6kp7jGPt0n6rTPeL77QE.ico",
            type: CONFIG.T.image,
            rel: CONFIG.R.icon,
        }];
    },

    tests: [
        "http://video.yandex.ru/users/remnjoff/view/347/"
    ]
};