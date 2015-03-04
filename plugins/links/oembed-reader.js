module.exports = {

    getLink: function(oembed, whitelistRecord, __readabilityEnabled) {

        if (oembed.type === "link" && oembed.html && whitelistRecord.isAllowed && whitelistRecord.isAllowed('oembed.link', "reader")) {
            
            return {
                html: oembed.html,
                type: CONFIG.T.safe_html,
                rel: [CONFIG.R.reader, CONFIG.R.inline]
            };
        }
    }
};