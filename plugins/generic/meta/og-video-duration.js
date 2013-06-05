module.exports = {

    getMeta: function(meta) {

        if (!meta.og)
            return;

        return {
            duration: meta.og.duration || (meta.og.video && meta.og.video.duration)
        }
    }
};