module.exports = {

    re: [
        /^https?:\/\/players\.brightcove\.net\/(\d+)\/([a-zA-Z0-9\-]+|default)_default\/index.html\?videoId=(\d+)/i
    ],

    mixins: [
        "*"
    ],

    //HTML parser will 404 if BC account or player does not exist.
    getLink: function(urlMatch) {

        return {
            href: '//players.brightcove.net/' + urlMatch[1] + '/' + urlMatch[2] + '_default/index.html?videoId=' + urlMatch[3] + '&for=embed',
            rel: [CONFIG.R.player, CONFIG.R.html5],
            type: CONFIG.T.text_html,
            // aspect-ratio not known, use default...
        };
    }

};    