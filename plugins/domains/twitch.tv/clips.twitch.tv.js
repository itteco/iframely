export default {

    re: [
        /^https?:\/\/clips.twitch\.tv\/([^\?\/]+)(?:\?[^\?]+)?$/i,
        /^https?:\/\/www\.twitch\.tv\/\w+\/clip\/([^\?\/]+)/i
    ],

    mixins: ['*'],

    // This is here just as a fallback and tests. There's actually ld.video on the page.
    getData: function(urlMatch, meta) {
        if (!(meta.ld && meta.ld.video) && urlMatch[1] !== 'embed') {
            return {
                schemaVideoObject: {
                    embedURL: `https://clips.twitch.tv/embed?clip=${urlMatch[1]}&autoplay=false`
                }
            }
        }
    },

    tests: [{skipMethods: ['getData']},
        "https://clips.twitch.tv/UgliestBenevolentAnteaterM4xHeh",
        "https://www.twitch.tv/tfue/clip/AgileCallousOpossumBudBlast"
    ]
};