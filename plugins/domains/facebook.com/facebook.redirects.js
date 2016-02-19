module.exports = {

    re: [        
        /^https?:\/\/m\.facebook\.com\/story\.php/i,
        /^https?:\/\/(?:www|m|business)\.facebook\.com\/login\.php/i,
        /^https?:\/\/m\.facebook\.com/i,
        /^https?:\/\/facebook\.com\/l\.php\?u=/i
    ],

    getData: function(url, meta, cb) {

        if (meta["html-title"] === "Facebook" || meta["html-title"] === "Leaving Facebook...") {
            // the content is not public
            return cb({responseStatusCode: 403});
        }

        if (/^https?:\/\/(?:www|m|business)\.facebook\.com\/login\.php/i.test(url)) {
            // redirect to login
            return cb({responseStatusCode: 403});
        }

        
        if (meta["html-title"] === "Content Not Found") {
            // for mobiles pages like https://m.facebook.com/story.php?story_fbid=654911224606798 fb doesn't return 404
            return cb({responseStatusCode: 404});
        } 
        

        // Little hack for FB mobile URLs, as FB embeds don't recognize it's own mobile links.
        if (url.indexOf("m.facebook.com/story.php") > -1) {
            return cb({redirect: url.replace("m.facebook.com/story.php", "www.facebook.com/permalink.php")});
        } else if (url.indexOf("m.facebook.com/") > -1) {
            return cb({redirect: url.replace("m.facebook.com", "www.facebook.com")});
        }

        if (url.indexOf('facebook.com/l.php?u=') > -1) {
            return cb({redirect: decodeURIComponent(url.match(/u=([^&]+)/i)[1])});
        }        

        cb(null);
    },

    tests: [{
        noFeeds: true
    }]
};