export default {

    prepareLink: function(whitelistRecord, options, link, plugin) {

        if (!link.error 
            && link.href 
            && CONFIG.IGNORE_DOMAINS_RE && CONFIG.IGNORE_DOMAINS_RE instanceof Array 
            && CONFIG.IGNORE_DOMAINS_RE.some(function(re) {
                return re instanceof RegExp && re.test(link.href);
            })
        ) {
            link.error = "This link is ignored in CONFIG";
        }
    }
};