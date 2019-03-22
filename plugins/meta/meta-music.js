module.exports = {

    getMeta: function(meta) {
        if (meta.music) {
	        return {
	            duration: meta.music.duration,
	            date: meta.music.release_date
	        }
    	}
    }
};