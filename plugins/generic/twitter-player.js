module.exports = {

    getLink: function(twitter, whitelistRecord) {

        //if (twitter.player && whitelistRecord.isAllowed && whitelistRecord.isAllowed('twitter.player')) {

            return {
                href: twitter.player.value || twitter.player,
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.twitter],
                width: twitter.player.width,
                height: twitter.player.height
            };
        //}
    }
};