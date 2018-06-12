module.exports = {

    getData: function(video_src) {
        
        if (/^https?:\/\/player(?:\-[a-z-Z\-]+)?\.cnevids\.com\/(?:embed|iframe|script)\/[0-9a-zA-Z]+\/[0-9a-zA-Z]+/i.test(video_src)) {
            return {
                __promoUri: {
                    url: video_src.replace(/player\-[a-z-Z\-]+/, 'player').replace('/script/', '/iframe/'),
                    rel: 'No rel=promo is required' // this field is just for debugging here. Not required
                }
            };            
        }
    }

    // http://video.self.com/watch/self-x-tone-it-up-challenge
    // http://video.architecturaldigest.com/watch/the-simple-beauty-of-rafael-vinoly-s-architecture
    // https://thescene.com/watch/pitchfork/pitchfork-live-watch-jessy-lanza-perform-never-enough?source=player_scene_logo

};