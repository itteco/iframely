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
        http://www.laravelpodcast.com/episodes/27610-episode-42-activerecord-the-school-of-zonda
        http://www.laravelpodcast.com/episodes/32762-episode-43-open-source-money-rocket-league
        http://bikeshed.fm/57
        http://www.laravelpodcast.com/episodes/55797-episode-51-dusky-christmas
        http://www.travandlos.com/47
        http://podcast.emojiwrap.com/episodes/53140-4-but-some-people-hated-the-blob
        */        
    ]
};