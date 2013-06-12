module.exports = {

    //twitvid will re-direct here
    //TODO: extract YouTube & Vimeo players
    mixins: [
        "canonical",
        "og-site",
        "og-title",
        "twitter-image",
        "twitter-player-responsive",
        "favicon"
    ],

    tests: [
    /*{
        page: "http://blog.telly.com/",
        selector: ".main_content a"
    },*/
        "http://telly.com/Q84DI7"
    ]
};