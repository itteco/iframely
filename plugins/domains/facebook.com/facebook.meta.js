import * as entities from 'entities';

import facebook_post from './facebook.post.js';
import facebook_video from './facebook.video.js';

export default {

    /**
     * HEADS-UP: New endpoints as of Oct 24, 2020:
     * https://developers.facebook.com/docs/plugins/oembed/
     * Please configure your `access_token` in your local config file
     * as desribed on https://github.com/itteco/iframely/issues/284.
     */ 

    re: [].concat(facebook_post.re, facebook_video.re),

    mixins: [
        "domain-icon",
        "oembed-author",
        "oembed-canonical",
        "oembed-site"
    ],

    getMeta: function(oembed) {

        if (oembed.html) {

            var description = oembed.html.match(/<p>([^<>]+)<\/p>/i);
            description = description ? description[1]: '';

            var author = oembed.html.match(/Posted by <a(?:[^<>]+)>([^<>]+)<\/a>/);
            author = author ? author[1]: oembed.author_name;

            var title = oembed.html.match(/>([^<>]+)<\/a><p>/i);
            title = title ? title[1] : author;

            return {
                title: title ? entities.decodeHTML(title) : oembed.title,
                description: description ? entities.decodeHTML(description) : oembed.description,
                author: author
            };
        }
    },

    tests: [{
        noFeeds: true
    }]
};