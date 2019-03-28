const $ = require('cheerio');
const querystring = require('querystring');
const URL = require("url");

module.exports = {

    re: /https?:\/\/codepen\.io\/([a-z0-9\-_]+)\/(pen|details|full)\/([a-z0-9\-]+)/i,

    mixins: [
        "oembed-thumbnail",
        "oembed-author",
        "oembed-site",
        "oembed-title",
        "description",        
        "domain-icon"
    ],

    getLink: function(oembed, options, urlMatch) {

        if (urlMatch[1] === 'anon') {
            return { // Anonymous Pens can't be embedded
                    // return icon to avoid fallback to generic (whitelisted) parser
                href: 'http://codepen.io/logo-pin.svg',
                type: CONFIG.T.icon,
                rel: CONFIG.R.icon
            }
        }

        var $container = $('<div>');
        try{
            $container.html(oembed.html);
        } catch(ex) {}

        var $iframe = $container.find('iframe');

        if ($iframe.length == 1) {

            var href = $iframe.attr('src');
            var params = URL.parse(href, true).query;

            var click_to_load = options.getRequestOptions('codepen.click_to_load', /\/embed\/preview\//.test(href));
            href = href.replace(/\/embed\/(?:preview\/)?/, '/embed/').replace(/\/embed\//, '/embed/' + (click_to_load ? 'preview/' : ''));

            params.height = parseInt(options.getRequestOptions('codepen.height')) || oembed.height;

            var theme = options.getRequestOptions('players.theme', params.theme || 'auto');

            if (theme === 'auto') {
                delete params['theme-id'];
            } else {
                params['theme-id'] = theme;
            }

            return {
                href: href.replace(/\?.+/, '') + querystring.stringify(params).replace(/^(.)/, '?$1'),
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
            };
        }
    },

    tests: [ {
        pageWithFeed: "http://codepen.io/popular/",
        selector: ".cover-link"
    },
        "http://codepen.io/kevinjannis/pen/pyuix",
        "http://codepen.io/nosecreek/details/sprDl",
        "http://codepen.io/dudleystorey/pen/HrFBx"
    ]

};
