export default {

    // also used for hosted simplecasts
    re: [
        /^https?:\/\/[a-zA-Z0-9\-_]+\.simplecast\.com\/episodes\/[a-zA-Z0-9\-]+/i,
        /^https?:\/\/simplecast\.com\/s\/[a-zA-Z0-9\-]+/i,
    ],

    mixins: ["*"],

    getLink: function(twitter, options) {

        if (twitter.player && twitter.player.value) {
            var theme = options.getRequestOptions('players.theme', 'light');

            var href = twitter.player.value.match(/^[^\?]+\??/)[0];
            href += href.indexOf('?') > -1 ? '' : '?';
            href += theme === 'dark' ? (/player\.simplecast\.com/i.test(href) ? 'dark=true' : 'color=3d3d3d') : '';

            var opts = {
                theme: {
                    label: CONFIG.L.theme,
                    value: theme,
                    values: {
                        dark: CONFIG.L.dark,
                        light: CONFIG.L.light
                    }
                }
            }

            return {
                href: href,
                accept: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.audio, CONFIG.R.oembed],
                height: /embed\.|player\./i.test(href) ? 200 : twitter.player.height || 200, // twitter.player.height is sometimes 180 as in oEmbed, but that's not enough
                options: opts
            };
        }
    },

    tests: [    
        "https://tgd.simplecast.com/episodes/dan-blackman-and-robyn-kanner-the-power-7fe152f4",
        "https://i4ctrouble.simplecast.com/episodes/ep-168-a-goodbye-for-now-cZRPJJkH",
        "https://web3-with-a16z.simplecast.com/episodes/prediction-markets-information-aggregation-mechanisms",
        "https://a-satellite-view.simplecast.com/episodes/theyre-off-to-a-cataclysmically-bad-start-for-all-the-world-to-see",
        "https://the-smerconish-podcast.simplecast.com/episodes/todays-poll-question-should-joe-have-pardoned-hunter",

        /*
        http://bikeshed.fm/54
        http://bikeshed.fm/57
        https://podcast.emojiwrap.com/episodes/17-no-time-for-hands-openhands-with
        http://podcast.thegadgetflow.com/mark-campbell-inventurex
        */        
    ]
};