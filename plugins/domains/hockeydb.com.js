export default {

    re: /^https?:\/\/www\.hockeydb\.com\/ihdb\/stats\/pdisplay\.php\?pid=(\d+)/i,

    mixins: ["*"],

    getLink: function(urlMatch, cheerio) {

        var links = [{
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.app, CONFIG.R.html5, CONFIG.R.ssl],
            html:'<script type="text/javascript" src="https://www.hockeydb.com/em/?pid=' + urlMatch[1] + '"></script>',
            // href: 'http://www.hockeydb.com/em/?pid=' + urlMatch[1],
            width: 604
        }];

        // we also need a thumbnail for SSL fallback to summary card
        var $img = cheerio('img[itemprop*="image"]');
        if ($img.length) {

            links.push({
                href: $img.attr('src'),
                rel: CONFIG.R.thumbnail,
                type: CONFIG.T.image
            });
        }        

        return links;
    },

    tests: [
        "http://www.hockeydb.com/ihdb/stats/pdisplay.php?pid=89716",
        "http://www.hockeydb.com/ihdb/stats/pdisplay.php?pid=73254"
    ]
};