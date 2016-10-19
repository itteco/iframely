module.exports = {

    re: /^https?:\/\/(?:www\.)?dropbox\.com\/s\/[^?]+\.(png|jpg|jpeg)(\?dl=\d+)?$/i,

    mixins: ['*', 'og-image-rel-image'],

    getData: function(meta, cb) {    

        if (/dropbox.+?error/i.test(meta["html-title"])) {

            return cb({responseStatusCode: 404});

        } else {

	        return cb(null);
    	}
    },


    tests: ["https://www.dropbox.com/s/fwsudc05agl2pwo/Screenshot%202016-08-16%2009.54.37.png?dl=0"]
    // error: https://www.dropbox.com/s/iyyric8d1aid51g/2013-12-23%2012.23.15.png

};