var $ = require('cheerio');

module.exports = {

    provides: "sm4",

    getLink: function(sm4, whitelistRecord) {

        if (!(sm4.video && sm4.video.embed && whitelistRecord.isAllowed && whitelistRecord.isAllowed('sm4.video'))) {
            return;
        }

        var player = {
            type: CONFIG.T.text_html,
            rel:[CONFIG.R.player, CONFIG.R.sm4]
        };        

        var $container = $('<div>');
        
        try {
            $container.html(sm4.video.embed);
        } catch(ex) {}

        var $iframe = $container.find('iframe');

        if ($iframe.length == 1 && $iframe.attr('width') && $iframe.attr('height')) {

            player.href = $iframe.attr('src');

            if (whitelistRecord.isAllowed('sm4.video', 'ssl')) {
                player.href = player.href.replace(/^http:\/\//i, '//');
            }

            if (whitelistRecord.isAllowed('sm4.video', 'responsive')) {
                player['aspect-ratio'] = $iframe.attr('width') / $iframe.attr('height');
            } else {
                player.width = $iframe.attr('width');
                player.height = $iframe.attr('height')
            }

            if (whitelistRecord.isAllowed('sm4.video', 'autoplay')) {
                player.rel.push(CONFIG.R.autoplay);
            }
            if (whitelistRecord.isAllowed('sm4.video', 'html5')) {
                player.rel.push(CONFIG.R.html5);
            }

            return player;
        }    
    },

    getMeta: function (sm4) {
        return {
            author: sm4.category
        }
    },

    getData: function (meta) {
        
        if (meta.sm4) {
            return {
                sm4: meta.sm4
            }
        }
    }

    /*
    http://thedailyshow.cc.com/guests/neil-degrasse-tyson/2abri1/neil-degrasse-tyson
    http://tosh.cc.com/video-clips/gs28zs/kid-delivery
    http://www.cc.com/video-clips/vyienh/comedy-central-presents-insane-clown-posse
    http://thecolbertreport.cc.com/videos/y8jsuk/stephest-colbchella--013---daft-punk-d
    */
};