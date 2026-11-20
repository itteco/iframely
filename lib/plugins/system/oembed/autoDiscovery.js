import { matchesUrlRegexps } from '../../../utils.js';

const RE = CONFIG.IGNORE_DOMAINS_RE || CONFIG.BLACKLIST_DOMAINS_RE;

export default {

    provides: 'oembedLinks',

    /*
    * "__" two underscores means super mandatory param. Without that param plugin dependencies will not be searched.
    *
    * */
    getData: function(meta, oembedUtils, __noOembedLinks) {

        var oembedLinks = oembedUtils.findOembedLinks(null, meta);

        if (oembedLinks && oembedLinks instanceof Array) {

            oembedLinks = oembedLinks.filter(function(link) {

                return !matchesUrlRegexps(link.href, RE);
            });
        }

        if (oembedLinks && oembedLinks.length > 0) {
            return {oembedLinks: oembedLinks}
        }

    }
};
