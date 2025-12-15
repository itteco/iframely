export default {

    // Should go after 04_sll_validator that replaces ":443" with ''

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