module.exports = {

    getMeta: function(meta) {

    	var color = meta['theme-color'] || meta['msapplication-tilecolor'];

        if (color && /^#\w{6}$/i.test(color)) {
        	
            // https://developers.google.com/web/updates/2014/11/Support-for-theme-color-in-Chrome-39-for-Android
            return {
                'theme-color': color
            };
        }
    }
};
