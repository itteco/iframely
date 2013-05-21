module.exports = {

    useAlways: true,

    getMeta: function(meta) {
        return {
            duration: meta.music.duration
        };
    }
};