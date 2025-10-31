import * as cheerio from 'cheerio';


export default {

    getMeta: function(ld) {
        function clean(field) {
            if (field) {
                var $container = cheerio('<div>');
                try {
                    $container.html(field);
                } catch (ex) {
                    return undefined;
                }
                return $container.text();
            }
        }

        if (ld.newsarticle) {
            return {
                title: clean(ld.newsarticle.headline),
                category: clean(ld.newsarticle.articlesection),
                description: clean(ld.newsarticle.description)
            }
        }
    },

    getLink: function(ld) {

        if (ld.newsarticle && ld.newsarticle.thumbnailurl) {
            return {
                href: ld.newsarticle.thumbnailurl,
                type: CONFIG.T.image,
                rel: CONFIG.R.thumbnail
            }
        }
    }

    // ex: 
    // http://www.app.com/story/entertainment/music/2017/03/17/springsteen-legacy-apmff-upstage-film-explores-1970-asbury-park/99313864/
    // https://www.nhl.com/video/oshie-buries-ppg-with-a-backhand/c-51625603?tcid=tw_video_content_id
};
