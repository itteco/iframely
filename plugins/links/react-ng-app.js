module.exports = {

    highestPriority: true,

	provides: '__appFlag',

    getData: function(meta, cb) {

        var title = (meta.og && meta.og.title) || (meta.twitter && meta.twitter.title) || meta.title || meta['html-title'];

    	if ((meta.fragment == '!' && /{{.+}}/.test(title)) || /^{{.+}}$/.test(title))  {
    		//ex.: 	http://www.hitbox.tv/wavybabygaming
    		//		http://bteekh.com/5orm/post/9695/?ref=related
            //      https://maps.mysidewalk.com/a4c623c9fd
            //      https://www.vfiles.com/news/i-want-to-show-the-fashion-industry-that-the-future-is-coming-model-lilwavii-on-his-digital-breakthrough

    		return cb(null, {
                __appFlag: true,
                message: "This looks like JS app with {{...}} values in META section. If you are the owner, please run templates on the server."
            });
    	} else {
    		return cb();
    	}

    }
};