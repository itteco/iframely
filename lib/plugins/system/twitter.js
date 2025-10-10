export default {

    provides: 'self',

    listed: true,

    getData: function(meta) {
        if (meta.twitter) {

            var twitter = meta.twitter;
            if (twitter.player && twitter.player instanceof Array) {
                twitter.player = twitter.player[0];
            }
            return {
                twitter: twitter
            };
        }
    }
};
