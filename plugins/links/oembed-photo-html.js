import * as cheerio from 'cheerio';

export default {

    // this is the case of oembed photo or image, but with the html field
    // ex: 
    // https://be1d.ac-dijon.fr/mediacad/m/118
    // https://flii.by/file/rk3mg02r7kf/
    // https://stock.adobe.com/au/stock-photo/fresh-orange/95965825

    getLink: function(oembed, whitelistRecord) {

        if ((oembed.type === "photo" || oembed.type === "image") && !oembed.url && oembed.html && whitelistRecord.isAllowed && whitelistRecord.isAllowed('oembed.photo')) {

            var image = {
                type: CONFIG.T.text_html,  // Always an iframe, either native, or hosted
                rel:[CONFIG.R.oembed, CONFIG.R.image, CONFIG.R.html5],
                'aspect-ratio': oembed.width / oembed.height // have to assume it's responsive
            };


            var $container = cheerio('<div>');
            try {
                $container.html(oembed.html5 || oembed.html);
            } catch (ex) {}

            var $iframe = $container.find('iframe');


            // if embed code contains <iframe>, return src
            if ($iframe.length == 1) {
                image.href = $iframe.attr('src');
            } else { 
                image.html = oembed.html || oembed.html5; // will render in an iframe
            }

            return image;
        }

    }
};