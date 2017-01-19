module.exports = {

    //provides: 'oembedLinks', // do not uncomment - it breaks play.spotify.com atm

    getData: function(video_src) {
        
        if (/^https?:\/\/player\.cnevids\.com\/embed\/[0-9a-zA-Z]+\/[0-9a-zA-Z]+/i.test(video_src)) {
            
            return {oembedLinks: [{
                    href: "https://player.cnevids.com/services/oembed?url=" + video_src,
                    rel: 'alternate',
                    type: 'application/json+oembed'
                }]}

        } else if (/^https?:\/\/player\-\w+\.cnevids\.com\/embed\/[0-9a-zA-Z]+\/[0-9a-zA-Z]+/i.test(video_src)) {
            return {
                __promoUri: {
                    url: video_src.replace (/player\-\w+/, 'player'),
                    rel: 'No rel=promo is required' // this field is just for debugging here. Not required
                }
            };            
        }
    }

    // http://video.self.com/watch/self-x-tone-it-up-challenge
    // http://video.architecturaldigest.com/watch/the-simple-beauty-of-rafael-vinoly-s-architecture
    // https://thescene.com/watch/pitchfork/pitchfork-live-watch-jessy-lanza-perform-never-enough?source=player_scene_logo

};