module.exports = {

    useAlways: true,

    getMeta: function(meta) {
        return {
            duration: meta.og.duration || (meta.og.video && meta.og.video.duration)
        }
    }
};