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
        "https://clips.twitch.tv/RacySweetJackalBlargNaut-Aurg1DNlYiUgIhJd",
        "https://clips.twitch.tv/CourageousRichPeafowlYouDontSay-opqgmVBfJExmluP9",
        "https://www.twitch.tv/uhsnow/clip/BlitheHedonisticQuailWutFace-0LqwKOVTwqmrSA_e?filter=clips&range=all&sort=time",
        "https://www.twitch.tv/uhsnow/clip/MuddyWimpyTeaNinjaGrumpy-X4CarF7QdWbStXJO",
    ]
};