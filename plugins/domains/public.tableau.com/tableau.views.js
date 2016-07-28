var utils = require('../../../lib/utils');

module.exports = {

    mixins: ['domain-icon'],

    provides: 'tableau_image',

    getMeta: function (tableau) {

        return {
            title: tableau.title,
            description: tableau.description,
            views: tableau.views,
            author: tableau.author,
            date: tableau.date,
            site: 'Tableau Software' // from og.site_name
        }
    },

    getData: function(tableau, options, cb) {

            var firstImage = 'http://public.tableau.com/static/images/wi/' + tableau.workbook + '/' + tableau.view + '/1.png';

            utils.getImageMetadata(firstImage, options, function(error, data) {

                var image = null;

                if (error || data.error) {

                    console.log ('Error getting first image for Tableau: ' + error);

                } else if (data.width && data.height) {

                    image = {tableau_image: {
                        href: firstImage,
                        type: CONFIG.T.image, 
                        rel: CONFIG.R.image,
                        width: data.width,
                        height: data.height
                    }};
                }

                cb(null, image);                

            });
    },

    getLinks: function(tableau, tableau_image) {

        if (tableau_image.width && tableau_image.height) {
            var links = [{                
                href: '//public.tableau.com/views/' + tableau.workbook + '/' + tableau.view + '?:showVizHome=no&:embed=true',
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.app, CONFIG.R.html5],
                'aspect-ratio': tableau_image.width / tableau_image.height,
                'max-width': tableau_image.width + 20
            }, {
                href: '//public.tableau.com/thumb/views/' + tableau.workbook + '/' + tableau.view,
                type: CONFIG.T.image,
                rel: CONFIG.R.thumbnail,
                width: 736,
                height: 454 // it's always the same
            }];

            links.push(tableau_image);

            return links;
        }
    },

    tests: [
        "http://public.tableau.com/views/williamsburghSubstitue_v2/L_pocalyse",
        "http://public.tableau.com/views/williamsburghSubstitue_v2/L_pocalyse?:embed=y&:showVizHome=no&:display_count=y&:display_static_image=y&:bootstrapWhenNotified=true",
        "https://public.tableau.com/profile/callie3559#!/vizhome/Philly2/Sheet2",
        // not responsive:
        "http://public.tableau.com/views/HEROremodel/Dashboard1",
        "http://public.tableau.com/shared/7P2SM3PQG?:display_count=no",
        "http://public.tableau.com/shared/X7RMWXZYQ?:display_count=yes",
        "http://public.tableau.com/shared/7P2SM3PQG?:display_count=no"
    ]
};