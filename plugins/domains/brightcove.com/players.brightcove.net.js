module.exports = {

    re: [
        /^https?:\/\/players\.brightcove\.net\/(\d+)\/([a-zA-Z0-9\-_]+|default)_default\/index.html\?(?:.+)?videoId=([a-zA-Z0-9\-:]+)/i        
    ],

    mixins: [
        "*"
    ],

    //HTML parser will 404 if BC account or player does not exist.
    getLink: function(url, urlMatch) {

        var player = {
            href: '//players.brightcove.net/' + urlMatch[1] + '/' + urlMatch[2] + '_default/index.html?videoId=' 
            + urlMatch[3] + (/&autoplay=true/.test(url) ? '&autoplay=true' : '') + '&for=embed',
            rel: [CONFIG.R.player, CONFIG.R.html5],
            type: CONFIG.T.text_html,
            'aspect-ratio': CONFIG.DEFAULT_ASPECT_RATIO
        }

        // this comes from `brightcove-in-page-promo` only and follows whitelistRecord
        if (/&autoplay=true/.test(url)) {
            player.rel.push(CONFIG.R.autoplay);
        } else {
            player.autoplay = "autoplay=true";
        }

        return player;
    }

};    