module.exports = {

	provides: '__appFlag',

    getData: function(meta, cb) {

        var title = (meta.og && meta.og.title) || (meta.twitter && meta.twitter.title) || meta.title || meta['html-title'];

    	if ((meta.fragment == '!' && /{{.+}}/.test(title)) || /^{{.+}}$/.test(title))  {
    		//ex.: 	http://www.hitbox.tv/wavybabygaming
    		//		http://bteekh.com/5orm/post/9695/?ref=related
            //      https://www.ideapod.com/idea/Being-Unaffected-by-Chang-San-Feng-part-1/57dfef4e8ed5eca45123744f
            //      https://maps.mysidewalk.com/a4c623c9fd

    		return cb(null, {__appFlag: true});
    	} else {
    		return cb();
    	}

    }
};