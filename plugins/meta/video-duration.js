export default {

    getMeta: function(meta) {

        if (!meta.video && !meta.duration) {
            return;
        }

        return {
            duration: meta.video && meta.video.duration || meta.duration
        };
    }
};