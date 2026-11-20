import { matchesUrlRegexps } from '../../../utils.js';

export default {

    // Should go after 04_sll_validator that replaces ":443" with ''

    prepareLink: function(whitelistRecord, options, link, plugin) {

        if (!link.error 
            && link.href 
            && matchesUrlRegexps(link.href, CONFIG.IGNORE_DOMAINS_RE)
        ) {
            link.error = "This link is ignored in CONFIG";
        }
    }
};
