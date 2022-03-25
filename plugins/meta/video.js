export default {

    getMeta: function(meta) {

        if (!meta.video) {
            return;
        }

        return {
            duration: meta.video.duration,
            date: meta.video.release_date,
            author: meta.video.writer,
            keywords: meta.video.tag
        };
    }
};