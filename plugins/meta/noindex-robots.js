module.exports = {

    getData: function(url, meta, cb) {

    	if (meta.robots && /noindex/i.test(meta.robots) && !meta.description && !meta.og && !meta.twitter) {
			console.log("robots not allowed for " + url);
		}

        return cb(meta.robots && /noindex/i.test(meta.robots) && !meta.description && !meta.og && !meta.twitter
            ? {
               responseStatusCode: 403
            } : null);
    }

};