var URL = require('url');
var jQuery = require('jquery');

module.exports = {

    re: [
        /https?:\/\/(?:www\.)?ocremix\.org\/remix\/OCR(\d+)\/?(?:[\?#].*)?$/i
    ],

    mixins: [
        'favicon'
    ],

    getData: function(url, urlMatch, $selector) {
        var main = $selector('#panel-main');
        var remix = $selector('h1').clone();
        var meta = main.find("ul strong");
        var game = meta.filter(function () { return jQuery.text(this) === 'Game'; }).next('a');
        var remixers = meta.filter(function () { return jQuery.text(this) === 'ReMixer(s)'; }).nextAll('a');
        var composers = meta.filter(function () { return jQuery.text(this) === 'Composer(s)'; }).nextAll('a');
        var songs = meta.filter(function () { return jQuery.text(this) === 'Song(s)'; }).nextAll('a');
        var youtube_url = $selector("#ytplayer").attr("data");
        var body = main.children("div").first().clone();

        // thumbnail hotlinking forbidden:
        body.find('a[href^="/game/"] img').parents('div').first().remove();
        body.children("div").first().remove();

        remix.children('*').remove();
        remix = remix.text().trim().replace(/^'(.*)'$/,'$1');

        var data = {
            ocremix_meta: {
                remix:     remix,
                url:       "http://ocremix.org/remix/OCR" + urlMatch[1] + "/",
                game:      game.text(),
                game_url:  URL.resolve(url, game.attr('href')),
                remixers:  parseLinks(remixers),
                composers: parseLinks(composers),
                songs:     parseLinks(songs)
            },
            html_for_readability: body.html(),
            ignore_readability_error: true
        };

        if (youtube_url) {
            youtube_url = URL.parse(URL.resolve(url, youtube_url)).path.split(/[\/\?&#]/g)[2];
            if (youtube_url) {
                data.ocremix_meta.youtube_url = "//www.youtube.com/embed/" + youtube_url;
            }
        }

        function parseLinks (elements) {
            return elements.toArray().map(function (element) {
                element = jQuery(element);
                return {
                    name: element.text(),
                    url:  URL.resolve(url, element.attr('href'))
                };
            });
        }

        return data;
    },
    
    getMeta: function (ocremix_meta) {
        var meta = {
            title:     ocremix_meta.game + " '" + ocremix_meta.remix + "'",
            canonical: ocremix_meta.url,
            author:    ocremix_meta.remixers.map(function (remixer) { return remixer.name; }).join(', ')
        };

        if (ocremix_meta.remixers.length === 1) {
            meta.author_url = ocremix_meta.remixers[0].url;
        }

        return meta;
    },

    getLink: function (ocremix_meta) {
        var links = [];
        
        if (ocremix_meta.youtube_url) {
            links.push({
                href: ocremix_meta.youtube_url,
                rel:  CONFIG.R.player,
                type: CONFIG.T.text_html
            });
        }

        return links;
    },

    tests: [{
        page: "http://ocremix.org/remixes/?&offset=0&sort=datedesc",
        selector: "td:nth-child(1) a"
    },
        "http://ocremix.org/remix/OCR00673/",
        "http://ocremix.org/remix/OCR01452/",
        "http://ocremix.org/remix/OCR02605/"
    ]
};
