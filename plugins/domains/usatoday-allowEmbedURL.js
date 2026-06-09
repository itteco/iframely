export default {

    re: 'usatoday.com',

    provides: '__allowEmbedURL',

    // Using for custom usatoday domains
    getData: function(options) {
        return {
            __allowEmbedURL: true
        }
    }
}