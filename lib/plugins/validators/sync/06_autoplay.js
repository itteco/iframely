var _ = require('underscore');

module.exports = {

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

            
            if (link.href.indexOf(play) > -1 || link.rel.indexOf(CONFIG.R.autoplay) == -1) {

               var stop = play.replace (/\=(\w+)/, function (p1, p2) {
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

                var rels = _.clone(link.rel); 
                var new_link = _.extend({}, link);
                new_link.rel = rels; // deep copy


                if (link.href.indexOf(play) > -1 ) { 
                    // original link is autoplay
                    if (link.rel.indexOf(CONFIG.R.autoplay) == -1 ) {
                        link.rel.push(CONFIG.R.autoplay);
                    }
                    
                    new_link.href = new_link.href.replace(play, stop);
                    if (new_link.rel.indexOf(CONFIG.R.autoplay) > -1 ) {
                        new_link.rel.splice(new_link.rel.indexOf(CONFIG.R.autoplay), 1);
                    }

                } else if (link.rel.indexOf(CONFIG.R.autoplay) == -1) { 

                    // original link isnt autoplay, leave it alone
                    // autoplay=false may autoplay. Many publishers react to any `autoplay` value

                    if (link.href.indexOf(stop) > -1) {
                        new_link.href = new_link.href.replace(stop, play);
                    } else  {
                        new_link.href += (new_link.href.indexOf('?') > -1 ? '&' : '?') + play;    
                    }
                    
                    new_link.rel.push(CONFIG.R.autoplay);

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