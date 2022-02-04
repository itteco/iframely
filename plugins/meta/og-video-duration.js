export default {

    getMeta: function(og) {

        return {
            duration: og.duration || (og.video && og.video.duration)
        }
    }
};