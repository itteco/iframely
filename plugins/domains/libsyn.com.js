export default {

    re: /^https?:\/\/[a-zA-Z0-9\.]+\.libsyn(?:pro)?\.com\//,

    mixins: [
        "*"
    ],

    getLink: function(iframe, meta, options) {

        const re = /^(?:https:)?\/\/(?:html5\-)?play(?:er)?\.libsyn\.com\/embed\/episode\/id\/\d+/i;
        const isVideo = meta.twitter && meta.twitter.stream && /\.mp4$/i.test(meta.twitter.stream.value);

        if (re.test(iframe.src)) {
            
            var href = iframe.src.match(re)[0];
            var player = {
                rel: [CONFIG.R.player, CONFIG.R.html5, CONFIG.R.oembed],
                type: CONFIG.T.text_html
            };            

            if (!isVideo) {

                if (!options.getRequestOptions('players.horizontal', true)) {
                    href += '/theme/standard';
                } else {
                    href += '/theme/custom';

                    if (options.getRequestOptions('libsyn.playlist', false)) {
                        href += '/height/400';
                        href += '/render-playlist/yes';
                        href += `/direction/${options.getRequestOptions('libsyn.direction', 'backward')}/`;
                        player.rel.push(CONFIG.R.resizable);
                    } else {
                        href += `/height/96`;
                    }

                    if (options.getRequestOptions('libsyn.hide_artwork', false)) {
                        href += '/thumbnail/no';
                    }

                    href += '/custom-color/' + options.getProviderOptions('libsyn.color', '88AA3C');
                }
            }

            player.href = href;

            if (isVideo) {
                player['aspect-ratio'] = 16/9;
                player['padding-bottom'] = 90;
            } else {

                player.rel.push(CONFIG.R.audio);

                if (!options.getRequestOptions('players.horizontal', true)) {

                    player.options = {
                        horizontal: {
                            label: CONFIG.L.horizontal,
                            value: false
                        }
                    };
                    player['aspect-ratio'] = 1;
                    player['padding-bottom'] = 46;

                } else {

                    player.options = {
                        hide_artwork: {
                            label: CONFIG.L.hide_artwork,
                            value: /\/thumbnail\/no/.test(href)
                        },
                        playlist: {
                            label: CONFIG.L.playlist,
                            value: /\/render\-playlist\/yes/.test(href)
                        },
                        horizontal: {
                            label: CONFIG.L.horizontal,
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
        "https://directory.libsyn.com/episode/index/id/3252958",
        "https://lowcarbmd.libsyn.com/episode-20-in-defense-of-docs",
        "https://thefeed.libsyn.com/202-podcasting-workflows-hardware-tips-and-numbers"
    ]
};