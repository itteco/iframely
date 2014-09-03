module.exports = {

    getMeta: function(meta) {

        // Player.

        var has_player = false;

        if (meta.og) {
            if (meta.og.video || (meta.og.type && (meta.og.type.indexOf('video') > -1 || meta.og.type.indexOf('movie') > -1))) {
                has_player = true;
            }
        }
        if (meta.twitter) {
            if (meta.twitter.player || meta.twitter.stream) {
                has_player = true;
            }
        }
        if (meta.video_src || meta.video_type) {
            has_player = true;
        }        

        if (has_player) {
            return {
                media: 'player'
            };
        }

        // Reader.

        var has_reader = false;

        var has_thumbnail = (meta.og && meta.og.image) || (meta.twitter && meta.twitter.image);

        if (has_thumbnail) {

            if (meta.og && meta.og.type && meta.og.type === 'article') {
                has_reader = true;
            }
        }

        if (has_reader) {
            return {
                media: 'reader'
            };
        }
    }
};