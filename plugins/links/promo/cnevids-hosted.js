module.exports = {

    provides: 'oembedLinks',

    getData: function(video_src) {
        
        if (/^https?:\/\/player\.cnevids\.com\/embed\/[0-9a-zA-Z]+\/[0-9a-zA-Z]+/i.test(video_src)) {
            
            return {oembedLinks: [{
                    href: "https://player.cnevids.com/services/oembed?url=" + video_src,                    
                    rel: 'alternate',
                    type: 'application/json+oembed'
                }]}

        } 
    }

    // http://video.self.com/watch/self-x-tone-it-up-challenge
    // http://video.architecturaldigest.com/watch/the-simple-beauty-of-rafael-vinoly-s-architecture

};