/**
 * This plugin relies on whitelist to detect Brightcove's embed-in-page players
 * http://docs.brightcove.com/en/perform/brightcove-player/guides/embed-in-page.html
 */

module.exports = {

    provides: '__promoUri',

    getData: function(cheerio, __allowBrightcoveInPage) {

        /* we are looking for following video on the page, and check that embed is allowed
                    <video
                        id="video-js-4306274716001"
                        data-account="1125911414"
                        data-player="VJ949r8Fg"
                        data-embed="default"
                        data-video-id="4306274716001"
                        class="main-media__video-player video-js"
                        autoplay>
                    </video>
                    <script src="//players.brightcove.net/1125911414/VJ949r8Fg_default/index.min.js"></script>
        */

        var $video = cheerio('video.video-js');

        if ($video.length == 1) {

            var embed = $video.attr('data-embed');
            var account = $video.attr('data-account');
            var player = $video.attr('data-player');
            var video_id = $video.attr('data-video-id');

            // Let's validate
            if (!embed || !account || !player || !video_id) {
                return;
            } 

            if (embed !== 'default' || !/^\d+$/.test(account)) {
                return;
            }

            return {
                __promoUri: 'https://players.brightcove.net/' + account + '/' + player + '_' + embed + '/index.html?videoId=' + video_id + (__allowBrightcoveInPage === 'autoplay' ? '&autoplay=true' : '')
            }
        }
    },

    /**
    * http://www.hollywoodreporter.com/video/vin-diesel-voicing-groot-guardians-615140
    * http://www.billboard.com/articles/columns/rock/6605231/eddie-van-halen-addiction-david-lee-roth-touring?mobile_redirection=false
    * http://www.mirror.co.uk/3am/celebrity-news/stephen-fry-blasted-dangerous-views-7733815
    */

};