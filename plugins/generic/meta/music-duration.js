module.exports = {

    useAlways: true,

    getMeta: function(meta) {

        if (!meta.music)
            return;

        return {
            duration: meta.music.duration
        };
    }
};