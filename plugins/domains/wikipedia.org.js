module.exports = {

    re: [
        /https:\/\/\w+\.(m\.)?wikipedia\.org\/wiki\/.+/i,
        /https:\/\/\w+\.(m\.)?wikimedia\.org\/wiki\/.+/i
    ],

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

        // Select image of file, or image of article.
        var $img = cheerio('#file img,.infobox .image img,.thumbimage');
        if ($img.length) {
            $img = cheerio($img[0]);
            result.thumb = $img.attr('src');
            result.thumb_width = $img.attr('width');
            result.thumb_height = $img.attr('height');
        }

        // File description.
        var $p = cheerio('.description');
        if ($p.length) {
            // Remove language label.
            $p.find('.language').remove();
        } else {
            // Article first paragraph.
            $p = cheerio('#mw-content-text p');
        }
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
    },

    tests: [{
        page: 'https://en.wikipedia.org/wiki/Main_Page',
        selector: '#mp-itn a'
    },
        "https://en.wikipedia.org/wiki/Paris"
    ]
};