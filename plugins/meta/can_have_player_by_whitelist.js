function hasDeny(whitelistRecord, path) {
    // TODO: fix error on indexOf.
    var tags = whitelistRecord.getQATags(path);
    return tags && tags.indexOf('deny') > -1;
}

module.exports = {

    notPlugin: true,

    getMeta: function(whitelistRecord) {

        // TODO: Get without wildcard.
        if (whitelistRecord &&
            (hasDeny(whitelistRecord, 'og.video')
            || hasDeny(whitelistRecord, 'oembed.video')
            || hasDeny(whitelistRecord, 'html-meta.video')
            || hasDeny(whitelistRecord, 'twitter.stream')
            || hasDeny(whitelistRecord, 'twitter.player'))) {
            return {
                can_have_player: true
            };
        }
    }
};