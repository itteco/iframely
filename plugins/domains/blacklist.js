// Allows to blacklist certain domains. Checks BLACKLIST_DOMAINS_RE from CONFIG, and if present, disables those domains.


module.exports = {

    re: CONFIG.BLACKLIST_DOMAINS_RE,

    notPlugin: CONFIG.BLACKLIST_DOMAINS_RE === null,

    mixins: false,

    getData: function(urlMatch, cb) {

        return cb({
            responseStatusCode: 410
        });
    }

};