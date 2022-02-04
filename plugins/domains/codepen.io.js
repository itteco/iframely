export default {

    re: /https?:\/\/codepen\.io\/(?:[a-z0-9\-_]+\/)?(pen|details|full)\/([a-z0-9\-]+)/i,

    mixins: [
        "oembed-thumbnail",
        "oembed-author",
        "oembed-site",
        "oembed-title",
        "oembed-iframe",
        //"description", // don't enable to avoid 403 from CodePen's htmlparser. Description is '...' in most cases anyway
        "domain-icon"
    ],

    getLink: function(oembed, iframe, options) {

        if (oembed.author_url ===  "https://codepen.io/anon/") {
            return { // And no fallback to generics
                message: "Anonymous Pens can't be embedded."
            }
        }

        var params = Object.assign(iframe.query);

        params.height = options.getRequestOptions('codepen.height', oembed.height);

        var theme = options.getRequestOptions('players.theme', params.theme || 'auto');

        if (theme === 'auto') {
            delete params['theme-id'];
        } else {
            params['theme-id'] = theme;
        }

        var href = iframe.assignQuerystring(params);
        var click_to_load = options.getRequestOptions('codepen.click_to_load', /\/embed\/preview\//.test(href));
        href = href.replace(/\/embed\/(?:preview\/)?/, '/embed/').replace(/\/embed\//, '/embed/' + (click_to_load ? 'preview/' : ''));

        return {
            href: href,
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.app, CONFIG.R.oembed, CONFIG.R.html5],
            height: params.height,
            options: {
                height: {
                    label: CONFIG.L.height,
                    value: params.height,
                    placeholder: 'ex.: 600, in px'
                },
                click_to_load: {
                    label: 'Use click-to-load',
                    value: click_to_load
                },
                theme: {
                    label: CONFIG.L.theme,
                    value: theme,
                    values: {
                        light: CONFIG.L.light,
                        dark: CONFIG.L.dark,
                        auto: CONFIG.L.default
                    }
                }
            }
        }
    },

    tests: [ {
        pageWithFeed: "http://codepen.io/popular/",
        selector: ".cover-link"
    },
        "http://codepen.io/kevinjannis/pen/pyuix",
        "http://codepen.io/nosecreek/details/sprDl",
        "http://codepen.io/dudleystorey/pen/HrFBx",
        "https://codepen.io/pen/vwOyvW"
    ]

};
