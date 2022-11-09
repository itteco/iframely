import statusPlugin from './twitter.status.js';
import timelinePlugin from './twitter.timelines.js';

export default {

    re: [...statusPlugin.re, ...timelinePlugin.re],

    provides: ['twitter_og'],

    getData: function(__allowTwitterOg, meta) {

        return {
            twitter_og: 
                meta.og ? meta.og : {
                    title: meta['html-title'],
                    description: meta.description
                }
        };
    }
};