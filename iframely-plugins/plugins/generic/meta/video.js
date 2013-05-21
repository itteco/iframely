module.exports = {

    useAlways: true,

    getMeta: function(meta) {
        return {
            duration: meta.video.duration,
            date: meta.video.release_date,
            author: meta.video.writer,
            keywords: meta.video.tag
        };
    }
};