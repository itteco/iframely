import usatoday_com from './usatoday.com.js';

export default {

    re: usatoday_com.re,

    provides: '__allowEmbedURL',

    getData: function(options) {
        return {
            __allowEmbedURL: true
        }
    }

}