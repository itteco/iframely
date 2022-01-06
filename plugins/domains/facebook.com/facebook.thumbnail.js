import facebook_post from './facebook.post.js';
import facebook_video from './facebook.video.js';

export default {

    provides: "__allowFBThumbnail",

    // FB has og:image, but returns Security Check Required on occasion.
    // So we keep dependency to oEmbed to make sure the embed loads first,
    // then we grab meta and get og:image from there if it's not "security checked" for rate limits.
    // Similar to what we do in domain-icon: ignore if failed.

    re: [].concat(facebook_post.re, facebook_video.re),

    getLink: function(url, __allowFBThumbnail, options, meta) {

        var thumbnail = meta.og && meta.og.image 
                        || meta.twitter && meta.twitter.image
                        || meta.ld && meta.ld.image && meta.ld.image.contenturl;

        if (meta['html-title'] && !/security check required/i.test(meta['html-title']) && thumbnail
            // && trye skip profile pictures for posts
            && (options.getRequestOptions('facebook.thumbnail') === 'any' // Explicitely allowed for an account.
                || meta.og && meta.og.video  // videos
                || meta.ld && meta.ld.image  // images
                || /\.png\?/.test(thumbnail) // profile pictures are jpegs
                || /safe_image\.php\?/.test(thumbnail) // URL cards
                )) {

            return {
                href: thumbnail,
                type: CONFIG.T.image,
                rel: CONFIG.R.thumbnail
            }
        } else if (meta['html-title'] && /security check required/i.test(meta['html-title'])) {
            console.log('FB security check on URL: ' + url);
        }
    },


    getData: function(oembed, options) {
        
        if (oembed.html && /class=\"fb\-(post|video)\"/i.test(oembed.html) 
            && options.getProviderOptions('facebook.thumbnail', true) && !/comment_id=/.test(oembed.html)) {

            options.followHTTPRedirect = true; // avoid security re-directs of URLs if any

            return {
                __allowFBThumbnail: true
            };
        }
    },

    tests: [{
        noFeeds: true,
        skipMethods: ['getData', 'getLink']
    }]
};