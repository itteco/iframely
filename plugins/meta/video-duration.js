module.exports = {

    getMeta: function(meta) {

        if (!meta.video) {
            return;
        }

        return {
            duration: meta.video.duration
        };
    }
};