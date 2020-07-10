/**
 * This plugin relies on whitelist to detect Brightcove's embed-in-page players
 * http://docs.brightcove.com/en/perform/brightcove-player/guides/embed-in-page.html
 */

module.exports = {

    provides: '__promoUri',

    getData: function(cheerio, __allowBrightcoveInPage) {

        /**
         * we are looking for following video on the page, and check that embed is allowed
         *          <video
         *              id="video-js-4306274716001"
         *               data-account="1125911414"
         *               data-player="VJ949r8Fg"
         *               data-embed="default"
         *               data-video-id="4306274716001"
         *               data-iframe-url="[ URL of Embed ]"
         *               class="main-media__video-player video-js"
         *               autoplay>
         *           </video>
         *           <script src="//players.brightcove.net/1125911414/VJ949r8Fg_default/index.min.js"></script>
        */

        var $video = cheerio('video.video-js');

        if ($video.length == 1) {

            var embed = $video.attr('data-embed');
            var account = $video.attr('data-account');
            var player = $video.attr('data-player');
            var video_id = $video.attr('data-video-id');
            var iframeUrl = $video.attr('data-iframe-url');

            // Let's validate
            if (!embed || !account || !player || !video_id) {
                return;
            } 

            if (embed !== 'default' || !/^\d+$/.test(account)) {
                return;
            }

            var uri = 'https://players.brightcove.net/' + account + '/' + player + '_' + embed + '/index.html?videoId=' + video_id;
            uri += __allowBrightcoveInPage === 'autoplay' ? '&autoplay=true' : '';
            uri += iframeUrl ? '&iframe-url=' + Buffer.from(iframeUrl).toString('base64') : '';

            return {
                __promoUri: { url: uri }
            }
        }
    },

    /**
    * http://www.hollywoodreporter.com/video/vin-diesel-voicing-groot-guardians-615140
    * http://www.billboard.com/articles/columns/rock/6605231/eddie-van-halen-addiction-david-lee-roth-touring?mobile_redirection=false
    * http://www.mirror.co.uk/3am/celebrity-news/stephen-fry-blasted-dangerous-views-7733815
    */

};