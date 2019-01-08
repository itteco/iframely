module.exports = {

    // used for hosted simplecasts
    re: /https?:\/\/simplecast\.com\/card\/[a-zA-Z0-9\-]+/i,

    mixins: ["*"],

    getLink: function(urlMatch) {

        return {
            href: urlMatch[0],
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.player, CONFIG.R.html5, CONFIG.R.oembed], // oembed rel makes it pass url!=canonical validation
            height: 94
        };
    },

    tests: [
        "https://simplecast.com/card/6e203f4f"
        /*
        http://bikeshed.fm/54
        http://bikeshed.fm/57
        http://podcast.emojiwrap.com/episodes/53140-4-but-some-people-hated-the-blob
        https://objectsharp.com/podcast/cosmos-db-everything-you-wanted-to-know-about-microsoft-azures-nosql-offering-in-about-30-minutes/
        */        
    ]
};