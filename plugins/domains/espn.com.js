module.exports = {

    re: [
        /https?:\/\/espn\.go\.com\/video\/clip\?id=(espn):(\d+)/i,
        /https?:\/\/(espn)\.go\.com\/video\/clip\?id=(\d+)/i,
        /https?:\/\/xgames\.espn\.go\.com\/(xgames)\/video\/(\d+)\//i
    ],

    mixins: ["*"],

    getLink: function(urlMatch) {

        // Fallback to Twitter:player as it was before March 8, 2016

        var player_id = urlMatch[1] === 'xgmames' ? 'id=' + urlMatch[2] + '&omniReportSuite=wdgespexpn' :
                        'cms=espn&id=espn:' + urlMatch[2];

        return {
            href: 'https://espn.go.com/video/iframe/twitter/?' + player_id,
            type: CONFIG.T.maybe_text_html, // ping href to check that it doesn't 404
            rel: [CONFIG.R.player, CONFIG.R.html5],
            "aspect-ratio": 16/9
        };
    },

    tests: [
        "http://espn.go.com/video/clip?id=espn:14780138",
        "http://espn.go.com/video/clip?id=13328484",
        "http://xgames.espn.go.com/xgames/video/13380522/real-moto-drake-mcelroy"
    ]
};