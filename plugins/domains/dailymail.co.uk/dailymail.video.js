import { decodeHTML5 } from 'entities';
import dailymail_embeddedvideo from './dailymail.embeddedvideo.js';
import dailymail_galleryvideo from './dailymail.galleryvideo.js';

export default {

    re: [].concat(dailymail_embeddedvideo.re, dailymail_galleryvideo.re),

    provides: 'dailymailVideo',

    getData: function(dailymailVideoID, cheerio) {

        var $player = cheerio((dailymailVideoID !== '' ? '#' + dailymailVideoID + ' ' : '' )+ 'video[data-opts]');
        // for galleries - it will be a single video on the page
        
        if ($player.length == 1) {
            return {
                dailymailVideo: JSON.parse(decodeHTML5($player.attr('data-opts')))
            }
        }
    },

    getMeta: function(dailymailVideo, decode) {
        return {
            title: decodeHTML5(decode(dailymailVideo.title)),
            description: decodeHTML5(decode(dailymailVideo.descr))
        }
    },

    getLinks: function(dailymailVideo) {

        return [{
            href: dailymailVideo.poster || dailymailVideo.thumbnail,
            type: CONFIG.T.image,
            rel: CONFIG.R.thumbnail
        }, {
            // if something is undefined - let getLinks fail to fall back to default parsers
            href: dailymailVideo.plugins['social-share'].embedUrl, // no SSL
            rel: CONFIG.R.player,
            type: CONFIG.T.text_html,             
            "aspect-ratio": 484 / 282, // taken from mp4 aspect
            "padding-bottom": 50 + 50 + 50,
            scrolling: 'no'
        }];
    },    

    tests: [{
        noFeeds: true
    },
        "https://www.dailymail.co.uk/tvshowbiz/article-2885993/A-look-unconventional-13-year-relationship-Helena-Bonham-Carter-Tim-Burton-movies-made.html#v-1467332342001"
    ]
};