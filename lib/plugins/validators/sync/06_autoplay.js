export default {

    prepareLink: function(link) {

        if (link.href &&  link.type && link.type.indexOf('video/') > -1 && link.rel.indexOf(CONFIG.R.autoplay) > -1) {
            // Remove "autoplay" from html5 videos.
            link.rel.splice(link.rel.indexOf(CONFIG.R.autoplay), 1);
            return;
        }

        // Legacy check, keep to maintain integrity of whitelist
        // Do not replace autoplay options if there is a rel autoplay, as otherwise the data may become inconsistent.
        if (link.href && link.rel.indexOf(CONFIG.R.player) > -1 && link.rel.indexOf(CONFIG.R.autoplay) == -1 && !link.autoplay) {
            link.href = link.href.replace(/(auto_play)=true/i, '$1=false');
            link.href = link.href.replace(/(auto)=true/i, '$1=false');
            link.href = link.href.replace(/(auto)=1/i, '$1=0');
            link.href = link.href.replace(/(autoPlay)=1/i, '$1=0');
            link.href = link.href.replace(/(autoPlay)=true/i, '$1=false');
            link.href = link.href.replace(/(autoStart)=true/i, '$1=false');
            link.href = link.href.replace(/(autoStart)=1/i, '$1=0');
        }        

        // create autoplay variant of the player if requested via link.autoplay attribute        
        if (link.href && link.rel.indexOf(CONFIG.R.player) > -1 && link.autoplay && typeof link.autoplay === "string" && link.autoplay.indexOf('=') > -1) { // it should always be a query-string

            var play = link.autoplay;
            // don't need this field any longer
            delete link.autoplay;
            
            /**
             * Three cases: 
             *  1) Link does not autoplay by default. We need to add an autoplay with autoplay=1.
             *  2) Link autoplays:
             *   - with autoplay=1 in src, maybe with no autoplay in rels
             *   - or without autoplay=1 in src, but autoplay in rels
             *  We need to add a non-autoplaying variant with autoplay=0
             */
            if ((link.href.indexOf(play) === -1 && link.rel.indexOf(CONFIG.R.autoplay) === -1)
                || link.href.indexOf(play) > -1
                || link.rel.indexOf(CONFIG.R.autoplay) > -1) {

               var stop = play.replace(/\=(\w+)/, function (p1, p2) {
                    var antonyms = {
                        '1': '0',
                        '0': '1',
                        'true': 'false',
                        'false': 'true',
                        'on': 'off',
                        'off': 'on'
                    };
                    return '=' + antonyms[p2];
                });

                const rel = link.rel;
                const RELS = [...rel];
                RELS.splice(link.rel.indexOf(CONFIG.R.autoplay), 1);
                delete link.rel;

                const RELS_WITH_AUTOPLAY = [...RELS, CONFIG.R.autoplay];
                var new_link = Object.assign({}, link);

                if (link.href.indexOf(play) > -1 ) {

                    // Original link is autoplay
                    link.rel = RELS_WITH_AUTOPLAY;

                    // Add a link without autoplay
                    new_link.href = new_link.href.replace(play, stop);
                    new_link.rel = RELS;

                } else if (/* link.href.indexOf(play) === -1 && */ rel.indexOf(CONFIG.R.autoplay) > -1 ) {

                    link.rel = RELS_WITH_AUTOPLAY;

                    // link.href.indexOf(play) === -1, no need to double-check
                    // Add a link without autoplay
                    new_link.href += (new_link.href.indexOf('?') > -1 ? '&' : '?') + stop;
                    new_link.rel = RELS;

                } else if (rel.indexOf(CONFIG.R.autoplay) === -1) { 

                    // Original link isnt autoplay, leave it as is
                    link.rel = RELS;

                    // Add a link with autoplay
                    if (link.href.indexOf(stop) > -1) {
                        new_link.href = new_link.href.replace(stop, play);
                    } else  {
                        new_link.href += (new_link.href.indexOf('?') > -1 ? '&' : '?') + play;
                    }
                    
                    new_link.rel = RELS_WITH_AUTOPLAY;
                }

                return {
                    addLink: new_link
                };
            }
            
        } else if (link.autoplay) {
            delete link.autoplay; // if not a string - just ignore it            
        }

    }
};