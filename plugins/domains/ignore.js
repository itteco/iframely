// Allows to ignore certain domains. Checks IGNORE_DOMAINS_RE from CONFIG, and if present, disables those domains.

const RE = CONFIG.IGNORE_DOMAINS_RE || CONFIG.BLACKLIST_DOMAINS_RE;

export default {

    re: RE,

    listed: false, // do not show up in iframe.ly/domains.json

    notPlugin: typeof RE === 'undefined',

    getData: function(urlMatch, cb) {

        return cb({
            responseStatusCode: 417,
            message: 'This URL is not allowed on owner\'s request or by Iframely admins.'
        });
    }

};