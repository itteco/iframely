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

        var thumbnail = meta.twitter?.image
                        || meta.og?.image
                        || meta.ld?.socialmediaposting?.image?.contenturl
                        || meta.ld?.socialmediaposting?.image && Array.isArray(meta.ld.socialmediaposting.image) // This one is for photos
                            && meta.ld.socialmediaposting.image.length === 1 && meta.ld.socialmediaposting.image[0].contenturl; 

        if (thumbnail?.url || thumbnail?.src) {
            thumbnail = thumbnail.url || thumbnail.src;
        }

        if (meta['html-title'] && !/security check required/i.test(meta['html-title']) && thumbnail
            /** Check for profile pictures is no longer required - 
             * FB does not give them for posts without a picture as of Jan 8, 2024
             *        
             * // && try skip profile pictures for posts
             * && (options.getProviderOptions('facebook.thumbnail') === 'any' //x Explicitely allowed for an account.
             *   || meta.og?.video
             *   || meta.twitter?.player  // videos
             *   || meta.ld?.socialmediaposting?.image  // images
             *   || meta.ld?.socialmediaposting?.sharedcontent
             *   || /\.png\?/.test(thumbnail) // profile pictures are jpegs
             *   || /safe_image\.php\?/.test(thumbnail) // URL cards
             *   || /\?url=/.test(thumbnail) // URL cards
             *   )
             */
            ) {

            return {
                href: thumbnail,
                type: CONFIG.T.image,
                rel: CONFIG.R.thumbnail
            }
        } else if (meta['html-title'] && /security check required/i.test(meta['html-title'])) {
            console.log('FB security check on URL: ' + url);
        }
    },


    getData: function(oembed, url, options) {
        
        if (oembed.html && /class=\"fb\-(post|video)\"/i.test(oembed.html) 
            && options.getProviderOptions('facebook.thumbnail', true) && !/comment_id=/.test(oembed.html)) {

            // Avoid security re-directs of URLs if any,
            // but fix canonical URLs for /share urls that now redirect to story.php
            if (!/facebook\.com\/(permalink|story)\.php\?/i.test(url)) {
                options.followHTTPRedirect = true; 
            }

            options.exposeStatusCode = true;
            options.provider = 'Facebook';

            return {
                __allowFBThumbnail: true
            };
        }
    },

    tests: [{
        noFeeds: true,
        skipMethods: ['getData', 'getLink'],
    }]
};