export default {

    // also used for hosted simplecasts
    re: [
        /^https?:\/\/[a-zA-Z0-9\-_]+\.simplecast\.com\/episodes\/[a-zA-Z0-9\-]+/i,
        /^https?:\/\/embed\.simplecast\.com\/[a-zA-Z0-9\-]+/i,
        /^https?:\/\/simplecast\.com\/s\/[a-zA-Z0-9\-]+/i
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
                rel: [CONFIG.R.player, CONFIG.R.audio, CONFIG.R.html5, CONFIG.R.oembed],
                height: /embed\.|player\./i.test(href) ? 200 : twitter.player.height || 200, // twitter.player.height is sometimes 180 as in oEmbed, but that's not enough
                options: opts
            };
        }
    },

    tests: [
        "https://embed.simplecast.com/c0e95371",        
        "https://tgd.simplecast.com/episodes/dan-blackman-and-robyn-kanner-the-power-7fe152f4"
        /*
        http://bikeshed.fm/54
        http://bikeshed.fm/57
        https://podcast.emojiwrap.com/episodes/17-no-time-for-hands-openhands-with
        http://podcast.thegadgetflow.com/mark-campbell-inventurex
        */        
    ]
};