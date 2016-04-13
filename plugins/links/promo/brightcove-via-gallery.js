module.exports = {

    getLink: function(url, meta, twitter, whitelistRecord) {

        if (whitelistRecord.isDefault 
            && (meta.generator && /^brightcove$/i.test(meta.generator)) 
            && (twitter.player && /^https?:\/\/players\.brightcove\.net\//i.test(twitter.player.value))) {

            return {
                href: twitter.player.value, 
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.html5],
                "aspect-ratio": twitter.player.width / twitter.player.height
            };
        }
    }


    /* Sample URLs for hosted Brightcove video galleries
        http://video.ibc.org/detail/videos/media-distribution/video/4486234369001/e102-sunday-1130-mam-is-dead?autoStart=true        
        http://video.massachusetts.edu/detail/videos/here-for-a-reason/video/4767578288001/transform?autoStart=true
        http://oncologyvu.brightcovegallery.com/detail/videos/treatment-methods/video/3880531728001/importance-of-the-nurse-patient-relationship?autoStart=true
        http://vod.miraclechannel.ca/detail/videos/all-episodes/video/4803972939001/the-leon-show---vaccines-and-your-health?autoStart=true
        http://video.brightcovelearning.com/detail/videos/managing-players/video/4805928382001/styling-players?autoStart=true
    */
};