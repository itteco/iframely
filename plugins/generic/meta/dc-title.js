module.exports = {

    getMeta: function(meta) {

    	var dc = meta.DC || meta.dc;

        if (dc && dc.title) 
        return {
            title: dc.title
        };
    }
};