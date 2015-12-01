var urlLib = require('url');

var iframelyApiRe = /iframe\.ly\/api\/iframe.+url=/i;

var res = [
    /iframe\.ly\/\w+/i,
    iframelyApiRe,
    /\/\/www\.youtube\.com\/embed\/\w+/i,
    /\/\/player\.vimeo\.com\/video\/\d+/i,
    /\/\/vine\.co\/v\/\w+\/embed/i
];

function extractGetParamUrl(src) {
    if (src.match(iframelyApiRe)) {
        var urlObj = urlLib.parse(src, true);
        return urlObj.query['url'];
    } else {
        return src;
    }
}

module.exports = {

    provides: '__promoUri',

    generic: true,

    getData: function(__forcePromo, cheerio) {

        var embeds = cheerio('a[data-iframely-url]');
        if (embeds.length) {
            var href = embeds.attr('href');
            return {
                __promoUri: extractGetParamUrl(href)
            };
        }

        embeds = cheerio('[data-embed-canonical]');
        if (embeds.length) {
            var href = embeds.attr('data-embed-canonical');
            return {
                __promoUri: href
            };
        }

        embeds = cheerio('iframe');
        var result;
        embeds.each(function() {
            if (result) {
                return;
            }
            var src = cheerio(this).attr('src');

            if (!src) {
                return;
            }

            var i = 0;
            while(i < res.length && !src.match(res[i])) {
                i++;
            }

            if (i < res.length) {
                result = src;
            }
        });

        if (result) {
            return {
                __promoUri: extractGetParamUrl(result)
            };
        }
    }
};