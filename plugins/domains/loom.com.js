export default {

    re: /^https?:\/\/(?:www\.)?loom\.com\/share\//i,

    mixins: ['*', 'domain-icon'],

    getLink: function(iframe, query, twitter, options) {

        if (!iframe.width || !iframe.height) {
            return;
        }

        const width = twitter.player?.width || iframe.width;
        const height = twitter.player?.height || iframe.height;

        var hideinfo = options.getRequestOptions('loom.hideinfo', 
                            !options.getProviderOptions('players.showinfo', true)
                        ) || query._hideinfo === "true" || !!query._hideinfo;

        if (hideinfo) {
            query.hide_owner = true;
            query.hide_share = true;
            query.hide_title = true;
            query.hideEmbedTopBar = true;
        }

        // Otherwise take only parameters from /embed redirect to /share....
        // but clean them up when user requests via request option
        var q = {};
        if (options.getRequestOptions('loom.hideinfo') !== false) {
            Object.keys(query).forEach(function(key) {
                if (/^hide/.test(key)) {
                    q[key] = query[key];
                    if (!hideinfo) {
                        hideinfo = true;
                    }
                }
            });
        }

        return {
            href: iframe.replaceQuerystring(q),
            type: CONFIG.T.text_html, // Validator fails because we receive x-frame-options. It actually works fine.
            rel: CONFIG.R.player,
            'aspect-ratio': width / height,
            options: {
                hideinfo: {
                    value: hideinfo,
                    label: "Hide player attribution info"
                }
            }
        }

    },

    tests: [
        // redirects here with the query-string:
        'https://www.loom.com/embed/e5b8c04bca094dd8a5507925ab887002?hide_owner=true&hide_share=true&hide_title=true&hideEmbedTopBar=true',
        'https://www.loom.com/share/0808e55f94a24992b2de488ac56d3815?_hideinfo=true',
        'https://www.loom.com/share/0808e55f94a24992b2de488ac56d3815',
        'https://www.loom.com/share/7f68fa7f01e349cab91b0c36168f68c3'
    ]

};