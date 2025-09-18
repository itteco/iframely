export default {

    re: /^https?:\/\/www\.hockeydb\.com\/ihdb\/stats\/pdisplay\.php\?pid=(\d+)/i,

    mixins: ["*"],

    getLink: function(urlMatch, cheerio) {

        var links = [{
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.app, CONFIG.R.ssl],
            html:'<script type="text/javascript" src="https://www.hockeydb.com/em/?pid=' + urlMatch[1] + '"></script>',
            // href: 'http://www.hockeydb.com/em/?pid=' + urlMatch[1],
            'max-width': 604,
            height: 414
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
        "https://www.hockeydb.com/ihdb/stats/pdisplay.php?pid=89716",
        "https://www.hockeydb.com/ihdb/stats/pdisplay.php?pid=73254",
        "https://hockeydb.com/ihdb/stats/pdisplay.php?pid=4910"
    ]
};