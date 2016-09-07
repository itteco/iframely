var URL = require("url");

module.exports = {

    getLink: function(video_src, whitelistRecord) {
        
        if (whitelistRecord.isDefault && /^https?:\/\/launch\.newsinc\.com\//i.test(video_src)) {

            var uri = URL.parse(video_src, true);
            var query = uri.query;

            if (query.data_feed_url) {                
                var feed_url = decodeURIComponent(query.data_feed_url);

                var feed_match = feed_url.match(/^https?:\/\/social\.newsinc\.com\/media\/json\/(\d+)\/(\d+)\//i);
                // ex http://social.newsinc.com/media/json/90161/28916332/singleVideoFeed.json

                if (feed_match) {
                    return {
                        href: '//launch.newsinc.com/embed.html?type=VideoPlayer/Single&widgetId=1&trackingGroup=' + feed_match[1] + '&videoId=' + feed_match[2],
                        rel: [CONFIG.R.player, CONFIG.R.autoplay, CONFIG.R.html5],
                        type: CONFIG.T.text_html,
                        'aspect-ratio': 16 / 9 

                    }
                }

            }
        }

    }

/*
http://video.nydailynews.com/Painting-With-Light--28452954
http://video.theadvocate.com/Resodding-the-infield-grass-at-LSUs-Alex-Box-StadiumSkip-Bertman-Field--Video-by-Bill-Feig--30519102?ndn.trackingGroup=91089&ndn.siteSection=site_section_id&ndn.videoId=30519102&freewheel=91089&sitesection=site_section_id&vid=30519102
http://video.wptv.com/HT-VIDEO-Orphaned-sisters-reunite-in-Sarasota-29800342?ndn.trackingGroup=91452&ndn.siteSection=wptv&ndn.videoId=29800342&freewheel=91452&sitesection=wptv&vid=29800342
http://video.roanoke.com/US-Army-veteran-awarded-shopping-spree-for-pet-30122550
http://video.breitbart.com/Mother-Says-Son-Suspended-Over-Nerf-Bullet-In-New-Jersey-29106888?ndn.trackingGroup=90085&ndn.siteSection=breitbart_nws_us_sty_vmppap&ndn.videoId=29106888&freewheel=90085&sitesection=breitbart_nws_us_sty_vmppap&vid=29106888
http://video.buffalonews.com/Sabres-finish-second-again-28916332?vcid=28916332&freewheel=90161&sitesection=dash
http://video.statesman.com/108-Nations-oldest-WWII-veteran-28327533?playlistId=15517
http://video.philly.com/Trump-repeats-supporters-vulgar-swipe-at-Cruz-30320651?vcid=30320651&freewheel=12651&sitesection=phillydotcom
http://video.tampabay.com/Lowry-Park-Zoos-6weekold-clouded-leopard-cub-28928072
http://video.bostonherald.com/MLB-Power-Rankings-Ranking-the-AL-East-contenders-31282681?playlistId=12065
http://video.baltimoresun.com/Dozens-Fall-Ill-On-Baltimore-Cruise-Ship-28488912?ndn.trackingGroup=91005&ndn.siteSection=latimes_hom_non_sec&ndn.videoId=28488912&freewheel=91005&sitesection=latimes_hom_non_sec&vid=28488912
http://video.stltoday.com/Honor-Guard-buries-one-of-their-own-28747584
http://video.ajc.com/You-Can-Now-Buy-Girl-Scout-Cookies-Online-with-Digital-Cookie-28208054?playlistId=5051
http://video.lauraingraham.com/MSNBC-Host-Says-Donald-Trump-is-as-Dangerous-as-Saddam-Hussein-29350852?utm_content=buffer03980&utm_medium=social&utm_source=facebook.com&utm_campaign=buffer
http://video.theindependent.com/Sights-and-sounds-from-2015-Harvest-of-Harmony-29773789?playlistId=15376
http://video.denverpost.com/Denver-Broncos-pregame-show-Super-Bowl-rematch-with-Carolina-Panthers-big-test-Week-1-31359028?ndn.trackingGroup=90115&ndn.siteSection=denverpost&ndn.videoId=31359028&freewheel=90115&sitesection=denverpost&vid=31359028
http://video.dailycaller.com/PolitiFact-No-President-Obama-didnt-say-people-are-too-smallminded-to-govern-their-own-affairs-26333855

broken:
http://video.bostonherald.com/-?ndn.trackingGroup=90017&ndn.siteSection=bostonherald&ndn.videoId=29235852&freewheel=90017&sitesection=bostonherald&vid=29235852
*/

};