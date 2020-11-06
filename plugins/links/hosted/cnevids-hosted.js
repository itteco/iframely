module.exports = {

    getData: function(video_src) {

        if (/^(?:https?:)?\/\/player(?:\-[a-z-Z\-]+)?\.cnevids\.com\/(?:embed|iframe|script)\/[0-9a-zA-Z]+/i.test(video_src)) {
            return {
                __promoUri: {
                    url: video_src.replace(/player\-[a-z-Z\-]+/, 'player').replace('/script/', '/iframe/'),
                    rel: 'No rel=promo is required' // this field is just for debugging here. Not required
                }
            };
        }
    }
};