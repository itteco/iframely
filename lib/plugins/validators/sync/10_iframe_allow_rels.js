export default {

    prepareLink: function(link, iframe) {
        // Take `allow attribute` from iFrame and push it as rels. 
        // Validate that href path is the same as iFrame path (excluding query-string).
        // Keep it here, before duplicate link merge.
        if (iframe 
            && iframe.src 
            && iframe.allow
            && iframe.allow.replace
            && link.href && link.rel
            && link.href.match(/^[^\?]+/i)[0] === iframe.src.match(/^[^\?]+/i)[0]) {

                var rels = iframe
                    .allow
                    .replace(/autoplay;?\s?\*?/ig, '')
                    .split(/\s?\*?(?:;|,)\s?\*?/g)
                    .filter(i => i);    // Skip empty string.

                link.rel = link.rel.concat(rels);
                link.rel = [...new Set(link.rel)];
        }
    }
};