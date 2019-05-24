module.exports = {

    provides: "__allowFBThumbnail",

    // FB has og:image, but returns Security Check Required on occasion.
    // So we keep dependency to oEmbed to make sure the embed loads first,
    // then we grab meta and get og:image from there if it's not "security checked" for rate limits.
    // Similar to what we do in domain-icon: ignore if failed.

    re: [
        //fb videos
        /^https?:\/\/(?:www|business)\.facebook\.com\/video\/video\.php.*[\?&]v=(\d{5,})(?:$|&)/i,
        /^https?:\/\/(?:www|business)\.facebook\.com\/photo\.php.*[\?&]v=(\d{5,})(?:$|&)/i,
        /^https?:\/\/(?:www|business)\.facebook\.com\/video\/video\.php\?v=(\d{5,})$/i,
        /^https?:\/\/(?:www|business)\.facebook\.com\/video\.php.*[\?&]v=(\d{5,})(?:$|&)/i,
        /^https?:\/\/(?:www|business)\.facebook\.com\/video\.php.*[\?&]id=(\d{5,})(?:$|&)/i,
        /^https?:\/\/(?:www|business)\.facebook\.com\/[a-zA-Z0-9.]+\/videos\/.+/i,

        //fb posts
        /^https?:\/\/(?:www|m|business)\.facebook\.com\/photo\.php\?fbid=(\d{10,})/i,
        /^https?:\/\/(?:www|m|business)\.facebook\.com\/([a-zA-Z0-9\.\-]+)\/(posts|activity)\/(\d{10,})/i,
        /^https?:\/\/(?:www|m|business)\.facebook\.com\/([a-zA-Z0-9\.\-]+)\/photos\/[^\/]+\/(\d{10,})/i,
        /^https?:\/\/(?:www|m|business)\.facebook\.com\/media\/set\/\?set=[^\/]+(\d{10,})/i        


    ],

    getLink: function(url, __allowFBThumbnail, meta) {

        if (meta['html-title'] && !/security check required/i.test(meta['html-title']) && meta.og && meta.og.image
            && !/\/p200x200\//i.test(meta.og.image)) { // skip profile pictures

            return {
                href: meta.og.image,
                type: CONFIG.T.image,
                rel: CONFIG.R.thumbnail
            }
        } else if (meta['html-title'] && /security check required/i.test(meta['html-title'])) {
            console.log('FB security check on URL: ' + url);
        }
    },


    getData: function(oembed, options) {
        
        if (oembed.html && /class=\"fb\-(post|video)\"/i.test(oembed.html) && !/comment_id=/.test(oembed.html)) {

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