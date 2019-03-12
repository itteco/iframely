module.exports = {

    mixins: [
        "*"
    ],

    getLink: function(twitter, options) {

        if (twitter.player && twitter.player.value && /^https?:\/\/html5\-player\.libsyn\.com\/embed\/episode\/id\/\d+/i.test(twitter.player.value)) {

            var is_video = twitter.stream && twitter.stream.value && /\.mp4$/i.test(twitter.stream.value);

            var href = twitter.player.value.match(/^https?:\/\/html5\-player\.libsyn\.com\/embed\/episode\/id\/\d+/i)[0];            

            if (!is_video) {

                if (!options.getRequestOptions('players.horizontal', true)) {
                    href += '/theme/standard';
                } else {
                    href += '/theme/custom';

                    if (options.getRequestOptions('libsyn.render_playlist', false)) {
                        href += '/height/400';
                        href += '/direction/backward/render-playlist/yes';
                    } else {
                        href += '/height/90';
                    }

                    if (options.getRequestOptions('libsyn.hide_artwork', false)) {
                        href += '/thumbnail/no';
                    }

                    href += '/custom-color/' + options.getProviderOptions('libsyn.color', '87A93A');
                }
            }

            var player = {
                href: href,
                rel: [CONFIG.R.player, CONFIG.R.html5],
                type: CONFIG.T.text_html
            };

            if (is_video) {
                player['aspect-ratio'] = 16/9;
                player['padding-bottom'] = 90;
            } else {

                player.rel.push(CONFIG.R.audio);

                if (!options.getRequestOptions('players.horizontal', true)) {

                    player.options = {
                        horizontal: {
                            label: 'Compact audio player',
                            value: false
                        }
                    };
                    player['aspect-ratio'] = 1;
                    player['padding-bottom'] = 46;

                } else {

                    player.options = {
                        hide_artwork : {
                            label: 'Hide artwork',
                            value: /\/thumbnail\/no/.test(href)
                        },
                        render_playlist: {
                            label: 'Add playlist',
                            value: /\/render\-playlist\/yes/.test(href)
                        },
                        horizontal: {
                            label: 'Compact audio player',
                            value: true
                        }
                    };

                player.height = player.href.match(/height\/(\d+)/)[1];
                player.scrolling = 'no';
                }
            }
                
            return player;
        }
    },

    tests: [
        "http://3manbreak.libsyn.com/10-build-a-bear-for-bradley-beal-december-1-of-3",
        "http://directory.libsyn.com/episode/index/id/3252958",
        // "http://mohrstories.libsyn.com/podcast/mor-stories-267-john-dimaggio", // broken
        "http://mumiapodcast.libsyn.com/message-for-red-emmas-book-fair-saturday-9-26-2015-baltimore",
        "http://3manbreak.libsyn.com/10-build-a-bear-for-bradley-beal-december-1-of-3"
    ]
};