module.exports = {

    getMeta: function(meta) {

        var has = false;

        if (meta.og) {
            if (meta.og.video || (meta.og.type && meta.og.type.indexOf('video') === 0)) {
                has = true;
            }
        }
        if (meta.twitter) {
            if (meta.twitter.player || meta.twitter.stream) {
                has = true;
            }
        }

        if (has) {
            return {
                media: 'player'
            };
        }
    }
};