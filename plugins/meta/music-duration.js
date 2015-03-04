module.exports = {

    getMeta: function(meta) {

        if (!meta.music) {
            return;
        }

        return {
            duration: meta.music.duration
        };
    }
};