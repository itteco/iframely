module.exports = {

	provides: '__reactAppFlag',

    getData: function(meta, cb) {

    	if (meta.fragment == '!' && /{{.+}}/.test(meta.title)) {

    		return cb(null, {__reactAppFlag: true});
    	} else {
    		return cb();
    	}

    }
};