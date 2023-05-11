export default {

    re: 'usatoday.com',

    provides: '__allowEmbedURL',

    getData: function(options) {
        return {
            __allowEmbedURL: true
        }
    }

}