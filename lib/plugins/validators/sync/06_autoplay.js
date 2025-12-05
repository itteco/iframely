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

            const play_querystring = link.autoplay; // e.g. 'autoplay=1'            
            delete link.autoplay;

            const stop_querystring = play_querystring.replace(/\=(\w+)/, function (p1, p2) {
                const antonyms = {
                    '1': '0',
                    '0': '1',
                    'true': 'false',
                    'false': 'true',
                    'on': 'off',
                    'off': 'on'
                };
                return '=' + antonyms[p2];
            });

            // Fix original link first, if needed
            if (link.href.indexOf(play_querystring) > -1 && link.rel.indexOf(CONFIG.R.autoplay) === -1) {
                link.rel.push(CONFIG.R.autoplay);
            }

            if (link.href.indexOf(stop_querystring) > -1 && link.rel.indexOf(CONFIG.R.autoplay) > -1) {
                link.rel.splice(link.rel.indexOf(CONFIG.R.autoplay), 1);
            }            

            var other = Object.assign({}, link);
            other.rel = [...link.rel];

            if (link.rel.indexOf(CONFIG.R.autoplay) === -1) { 

                // Add a link with autoplay
                if (link.href.indexOf(stop_querystring) > -1) {
                    other.href = other.href.replace(stop_querystring, play_querystring);
                } else  {
                    other.href += (other.href.indexOf('?') > -1 ? '&' : '?') + play_querystring;
                }
                other.rel.push(CONFIG.R.autoplay);

            } else {

                // Add a link without autoplay
                if (link.href.indexOf(play_querystring) > -1) {
                    other.href = other.href.replace(play_querystring, stop_querystring);
                } else  {
                    other.href += (other.href.indexOf('?') > -1 ? '&' : '?') + stop_querystring;
                }
                other.rel.splice(other.rel.indexOf(CONFIG.R.autoplay), 1);
            }

            return {
                addLink: other
            };

        } else if (link.autoplay) {
            delete link.autoplay; // if not a string - just ignore it            
        }

    }
};