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
        "domain-icon",
        "oembed-video"
    ],

    tests: [
        "http://video.yandex.ru/users/remnjoff/view/347/"
    ]
};