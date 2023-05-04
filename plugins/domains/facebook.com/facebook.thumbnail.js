export default {

    provides: "__allowFBThumbnail",

    // FB has og:image, but returns Security Check Required on occasion.
    // So we keep dependency to oEmbed to make sure the embed loads first,
    // then we grab meta and get og:image from there if it's not "security checked" for rate limits.
    // Similar to what we do in domain-icon: ignore if failed.

    re: [
        'facebook.post',
        'facebook.video'
    ],

    getLink: function(url, __allowFBThumbnail, options, meta) {

        var thumbnail = meta.twitter && meta.twitter.image
                        || meta.og && meta.og.image
                        || meta.ld && meta.ld.socialmediaposting.image && meta.ld.socialmediaposting.image.contenturl;

        if (meta['html-title'] && !/security check required/i.test(meta['html-title']) && thumbnail
            // && try skip profile pictures for posts
            && (options.getProviderOptions('facebook.thumbnail') === 'any' //x Explicitely allowed for an account.
                || meta.og && meta.og.video 
                || meta.twitter && meta.twitter.player  // videos
                || meta.ld && meta.ld.socialmediaposting && meta.ld.socialmediaposting.image  // images
                || meta.ld && meta.ld.socialmediaposting && meta.ld.socialmediaposting.sharedcontent
                || /\.png\?/.test(thumbnail) // profile pictures are jpegs
                || /safe_image\.php\?/.test(thumbnail) // URL cards
                || /\?url=/.test(thumbnail) // URL cards
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