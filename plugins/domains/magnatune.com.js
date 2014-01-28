var URL = require("url");
var jQuery = require("jquery");

module.exports = {

    re: [
        /^http:\/\/magnatune\.com\/artists\/albums\/([-_a-z0-9]+)(?:\/(lofi_play)?)?(?:[\?#].*)?$/i
    ],

    mixins: [
        "favicon"
    ],

    getData: function(urlMatch, meta) {

        var html_title = meta['html-title'].split(/\s*:\s+/);
        var title  = html_title[0].trim();
        var author = html_title[1].replace(/\s*\(listen for free\)\s*$/, '').trim();
        var sku    = urlMatch[1];

        if (urlMatch[2] === 'lofi_play') {
            var tmp = author;
            author = title;
            title  = tmp;
        }

        return {
            magnatune_meta: {
                title:       title,
                author:      author,
                license:     "All audio files at Magnatune are licensed under the Creative Commons Attribution-NonCommercial-ShareAlike license.",
                license_url: "http://magnatune.com/info/cc_licensed",
                embed_url:   "http://embed.magnatune.com/img/magnatune_player_embedded.swf?playlist_url=http://embed.magnatune.com/artists/albums/" +
                             sku + "/hifi.xspf&autoload=true&autoplay=&playlist_title="+encodeURIComponent(author + " : " + title)
            }
        };
    },

    getMeta: function(magnatune_meta) {
        var meta = jQuery.extend({}, magnatune_meta);
        delete meta.embed_url;
        return meta;
    },

    getLink: function(magnatune_meta) {
        var image_url = "http://he3.magnatune.com/music/" + encodeURIComponent(magnatune_meta.author) + "/" + encodeURIComponent(magnatune_meta.title) + "/cover";
        var links = [{
            href: magnatune_meta.embed_url,
            type: CONFIG.T.flash,
            rel:  CONFIG.R.player,
            "min-width":  300,
            "max-width":  600,
            "min-height": 150,
            "max-height": 600
        }, {
            href: image_url+".jpg",
            rel:  CONFIG.R.thumbnail,
            type: CONFIG.T.image_jpeg
        }];

        [30, 50, 100, 150, 200, 300, 600].forEach(function (size) {
            links.push({
                href: image_url + "_" + size + ".jpg",
                rel:  CONFIG.R.thumbnail,
                type: CONFIG.T.image_jpeg,
                width:  size,
                height: size
            });
        });

        return links;
    },

    tests: [{
        page: "http://magnatune.com/",
        selector: "p td font a:has(font)"
    },
        "http://magnatune.com/artists/albums/sieber-hidden/",
        "http://magnatune.com/artists/albums/fallingyou-adore/lofi_play"
    ]
};
