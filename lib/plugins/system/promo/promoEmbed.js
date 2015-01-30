var res = [
    /\/\/iframe\.ly\/\w+/i,
    /\/\/www\.youtube\.com\/embed\/\w+$/i,
    /\/\/player\.vimeo\.com\/video\/\d+/i,
    /\/\/w\.soundcloud\.com\/player\//i,
    /\/\/vine\.co\/v\/\w+\/embed/i
];

module.exports = {

    provides: '__promoUri',

    generic: true,

    getData: function(forcePromo, cheerio) {

        var embeds = cheerio('a[data-iframely-url]');
        if (embeds.length) {
            var href = embeds.attr('href');
            return {
                __promoUri: href
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

            var i = 0;
            while(i < res.length && !src.match(res[i])) i++;

            if (i < res.length) {
                result = src;
            }
        });

        if (result) {
            return {
                __promoUri: result
            };
        }
    }
};