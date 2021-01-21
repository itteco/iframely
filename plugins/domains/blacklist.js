// Allows to blacklist certain domains. Checks BLACKLIST_DOMAINS_RE from CONFIG, and if present, disables those domains.


module.exports = {

    re: CONFIG.BLACKLIST_DOMAINS_RE,

    private: true, // do not show up in iframe.ly/domains.json

    notPlugin: CONFIG.BLACKLIST_DOMAINS_RE === null,

    getData: function(urlMatch, cb) {

        return cb({
            responseStatusCode: 417,
            message: 'This domain is flagged as inappropriate.'
        });
    }

};