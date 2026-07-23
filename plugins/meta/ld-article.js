import * as cheerio from 'cheerio';


export default {

    getMeta: function(ld) {
        function clean(field) {
            if (field) {
                try {
                    return cheerio.load(field).text();
                } catch (ex) {
                    return undefined;
                }
            }
        }

        if (ld.article) {
            return {
                title: clean(ld.article.headline),
                category: clean(ld.article.articlesection),
                description: clean(ld.article.description)
            }
        }
    },

    getLink: function(ld) {

        if (ld.article?.image) {
            const images = Array.isArray(ld.article.image) ? ld.article.image : [ld.article.image]
            const links = [];

            images.forEach(image => {
                links.push({
                    href: image.contenturl || image.url,
                    type: CONFIG.T.image,
                    rel: [CONFIG.R.thumbnail, CONFIG.R.ld],
                    alt: image.caption || image.name
                })
            });

            return links;
        }
    }

    // ex: 
    // https://www.sabah.com.tr/yasam/2019/09/20/son-dakika-tuzladaki-yanginla-ilgili-flas-aciklama
};
