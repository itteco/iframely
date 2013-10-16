module.exports = {

    notPlugin: CONFIG.providerOptions.readability && CONFIG.providerOptions.readability.enabled === false,

    getData: function(html, meta, whitelistRecord) {

        if (whitelistRecord.isAllowed && whitelistRecord.isAllowed('oembed.link', "reader")) {
            return;
        }

        if (/<[^>]*class\s*=[^>]*instapaper_body/i.test(html)) {
            return {
                instapaper_flag: true
            }
        }

        if (meta.twitter && meta.twitter.player) {
            // Skip if has twitter player.
            return;
        }

        if (meta.og && ((meta.og.type && !{'article':1, 'blog':1}[meta.og.type]) || meta.og.video)) {
            // Skip if og type is not article explicitly.
            return;
        }

        if (meta.video_src) {
            // Skip if video_src is given
            return;
        }        

        var isArticle = html.match(/<article\b/i);

        if (!isArticle){
            (html.match(/((?!:\/\/)(?!%[0-9abcdef][0-9abcdef])[^<>={}\\/]){300,}/gi) || []).some(function(item) {
                if (item.match(/;/) && !item.match(/&#?[a-z0-9/-]+;/i)){
                    return false
                }

                var punctuation = item.match(/[\.,"'\_\+\:\-)]/g)
                var whitespace = item.match(/[\s\t\n]/g)
                if (punctuation && punctuation.length/item.length <= 0.05  && whitespace && whitespace.length/item.length >= 0.01 && whitespace.length/item.length <= 0.2) {
                    isArticle = true;
                    return true;
                }

            });
        }

        if (!isArticle)
            return;

        if (isArticle) {
            return {
                readability_data: {
                    html: html,
                    ignore_readability_error: false
                }
            }
        }
    },

    tests: [{
        pageWithFeed: "http://habrahabr.ru"
    }]
};