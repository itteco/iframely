module.exports = {

    //provides: 'oembedLinks', // do not uncomment - it breaks play.spotify.com atm

    getData: function(video_src) {
        
        if (/^https?:\/\/(?:www\.)?podbean\.com\/media\/player\/[^?]+/i.test(video_src)) {            
            
            return {oembedLinks: [{
                    href: "http://www.podbean.com/media/oembed?url=" + video_src.match(/^https?:\/\/(?:www\.)?podbean\.com\/media\/player\/[^?]+/i)[0],                    
                    rel: 'alternate',
                    type: 'application/json+oembed'
                }]}

        } 
    }

    // http://audio.javascriptair.com/e/032-jsair-publishing-javascript-packages-with-john-david-dalton-stephan-bonnemann-james-kyle-and-henry-zhu/

};