module.exports = {

    getLink: function(twitter, whitelistRecord) {

        if (twitter.card === "player" && whitelistRecord.isDefault  
            && twitter.player // && twitter.player.value && twitter.player.height && twitter.player.width // - width & height are actually wrong
            && /https?:?\/\/www\.tout\.com\/embed\/touts\/([a-zA-Z0-9]+)(?:\?platform=twcard)?$/i.test(twitter.player.value))  {

            var tout = twitter.player.value.match(/https?:?\/\/www\.tout\.com\/embed\/touts\/([a-zA-Z0-9]+)(?:\?platform=twcard)?$/i)[1];

            return {
                href: 'https://www.tout.com/embed/touts/' + tout + '?platform=twcard',
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.html5],
                autoplay: 'autoplay=true'
                // 'aspect-ratio': twitter.player.width / twitter.player.height // use default
            };
        }

    }
};