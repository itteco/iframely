module.exports = {

    getLink: function(meta, cb) {

    	if (meta.fragment == '!' && /{{.+}}/.test(meta.title)) {

    		return cb({responseStatusCode: 415});
    	} else {
    		return cb(null);
    	}

    }
};