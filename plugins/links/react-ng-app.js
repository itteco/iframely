module.exports = {

	provides: '__appFlag',

    getData: function(meta, cb) {

    	if ((meta.fragment == '!' && /{{.+}}/.test(meta.title)) || /^{{ng.+}}$/.test(meta.title))  {
    		//ex.: 	http://www.hitbox.tv/wavybabygaming
    		//		http://bteekh.com/5orm/post/9695/?ref=related

    		return cb(null, {__appFlag: true});
    	} else {
    		return cb();
    	}

    }
};