var URL = require("url");

module.exports = {

    re: [
        /^https?:\/\/launch\.newsinc\.com\/share\.html\?.+/i,
        /^https?:\/\/launch\.newsinc\.com\/embed.html\?.+/i
    ],

    mixins: ["*"],

    getLink: function(url) {

        var link = URL.parse(url, true);
        var query = link.query;
        var trackingGroup = query.trackingGroup;
        var siteSection = query.siteSection;
        var videoId = query.videoId;

        if (trackingGroup && videoId) {

            return [{                
                href: 'http://image.newsinc.com/' + videoId + '.sfxl.jpg',
                type: CONFIG.T.image,
                rel: CONFIG.R.thumbnail
                // let validator check it + add sizes
            }, {                
                href: '//launch.newsinc.com/embed.html?type=VideoPlayer/Single&widgetId=1&trackingGroup=' + trackingGroup + '&videoId=' + videoId + (siteSection ? '&siteSection=ndn' + siteSection : ''),
                        // embed code in player lists `widegtId=1`, but that one autoplays and no thumbnail available
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.html5, CONFIG.R.autoplay],
                "aspect-ratio": 16 / 9,
                scrolling: 'no'
            }];
        }
    },

    tests: [{
        noFeeds: true
    },
        "http://launch.newsinc.com/share.html?trackingGroup=91585&siteSection=unitedpress&videoId=30060852",
        "http://launch.newsinc.com/share.html?trackingGroup=91663&videoId=29926306",
        "http://launch.newsinc.com/share.html?trackingGroup=91002&siteSection=latimes_hom_non_sec&videoId=29750644",
        "http://launch.newsinc.com/?type=VideoPlayer/Single&widgetId=1&trackingGroup=69016&siteSection=unitedpress&videoId=28774159",
        "http://launch.newsinc.com/share.html?trackingGroup=90051&siteSection=nydailynews-entertainment&videoId=28336738",
        "http://launch.newsinc.com/share.html?trackingGroup=69016&siteSection=omahawh_spt_ncaa_sty_pp&videoId=28750854"
    ]

};