module.exports = {

    re: /https:\/\/\w+\.wikipedia\.org\/wiki\/.+/i,

    provides: 'wikiData',

    mixins: ["*"],

    getMeta: function(wikiData) {
        return {
            title: wikiData.title,
            description: wikiData.description
        };
    },

    getData: function(cheerio, decode) {

        var result = {};

        var $head = cheerio('#firstHeading');

        if ($head.length) {
            result.title = decode($head.text());
        }

        var $img = cheerio('.image img');
        if ($img.length) {
            result.thumb = $img.attr('src');
            result.thumb_width = $img.attr('width');
            result.thumb_height = $img.attr('height');
        }

        var $p = cheerio('#mw-content-text p');
        if ($p.length) {
            result.description = decode(cheerio($p[0]).text());
        }

        return {
            wikiData: result
        };
    },

    getLink: function(wikiData) {
        return {
            href: wikiData.thumb,
            type: CONFIG.T.image,
            rel: CONFIG.R.thumbnail,
            width: wikiData.thumb_width,
            height: wikiData.thumb_height
        };
    }
};