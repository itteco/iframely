export default {

    re: [
        /^https?:\/\/clips.twitch\.tv\/([^\?\/]+)(?:\?[^\?]+)?$/i,
        /^https?:\/\/www\.twitch\.tv\/\w+\/clip\/([^\?\/]+)/i
    ],

    mixins: ['*'],

    // This is here just as a fallback and tests and 404s.
    getData: function(urlMatch, meta, cb) {

        if (meta.ld && meta.ld.videoobject 
            && meta.twitter && meta.twitter.title === 'Twitch'
            && /^https?:\/\/clips\.twitch\.tv\/embed\?clip=$/i.test(meta.ld.videoobject.embedurl)) {

            return cb({
                responseStatusCode: 404
            });

        } else if ((!meta.ld || !meta.ld.videoobject) && urlMatch[1] !== 'embed') {

            return cb(null, {
                schemaVideoObject: {
                    embedURL: `https://clips.twitch.tv/embed?clip=${urlMatch[1]}&autoplay=false`
                }
            });

        } else {
            return cb();
        }
    },

    tests: [{skipMethods: ['getData']},
        "https://clips.twitch.tv/UgliestBenevolentAnteaterM4xHeh",
        "https://www.twitch.tv/tfue/clip/AgileCallousOpossumBudBlast",
        "https://www.twitch.tv/tfue/clip/ArtsyEnticingQueleaBrainSlug-kVfsJZyhxv2ggfmm"
    ]
};