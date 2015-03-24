module.exports = {

    re: /^https?:\/\/www\.bloomberg\.com.*\/graphics\//i,

    getLinks: function(meta) {

        if (CONFIG.providerOptions
            && CONFIG.providerOptions.bloomberg
            && CONFIG.providerOptions.bloomberg.iframeResizerScript
            && meta['iframely player']
            && meta['iframely player'].href
            && meta['iframely player'].type === CONFIG.T.text_html
            ) {

            return [{
                template_context: {
                    href: meta['iframely player'].href,
                    iframeResizerScript: CONFIG.providerOptions.bloomberg.iframeResizerScript
                },
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.reader, CONFIG.R.inline, CONFIG.R.ssl]
            }, {
                href: meta['iframely thumbnail'].href,
                type: meta['iframely thumbnail'].type,
                rel: CONFIG.R.thumbnail
            }];
        }
    }

};