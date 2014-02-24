var jquery = require('jquery');

module.exports = {

    getLink: function(oembed, whitelistRecord) {

/*
        var reader = oembed.type === "rich" && whitelistRecord.isAllowed && whitelistRecord.isAllowed('oembed.rich', "reader");
        var rich = oembed.type === "rich" && whitelistRecord.isAllowed && whitelistRecord.isAllowed('oembed.rich');
        var video = oembed.type === "video" && whitelistRecord.isAllowed && whitelistRecord.isAllowed('oembed.video');

        if (!video && !rich && !reader) {
            return;
        }
*/
        var rel = [CONFIG.R.oembed];
//        rel.push(video ? CONFIG.R.player : CONFIG.R.reader);


        var $container = jquery('<div>');
        try {
            $container.html(oembed.html5 || oembed.html);
        } catch (ex) {}

        var $iframe = $container.find('iframe');

        // if embed code contains <iframe>, return src
        if ($iframe.length == 1) {

            rel.push(CONFIG.R.player);

            return {
                href: $iframe.attr('src'),
                type: CONFIG.T.text_html,
                rel: rel,
                width: oembed.width,
                height: oembed.height
            };

        // otherwise apply renders
        } else { 
/*
            if (reader) {

                rel.push (CONFIG.R.inline);
                return {
                    html: oembed.html || oembed.html5,
                    type: CONFIG.T.safe_html,
                    rel: rel
                };                

            } else {
*/
                rel.push(CONFIG.R.reader);
                rel.push(CONFIG.R.inline);

//                return {
//                    type: CONFIG.T.text_html,
//                    rel: rel,
//                    template: "embed-html",
//                    template_context: {
//                        title: oembed.title,
//                        html: oembed.html || oembed.html5
//                    },
//                    width: oembed.width,
//                    height: oembed.height
//                }

            return {
                type: CONFIG.T.text_html,
                rel: rel,
                html: oembed.html || oembed.html5,
                width: oembed.width,
                height: oembed.height
            }
//            }
        }
    },


    // tests are only applicable with the whitelist, otherwise will throw errors on Test UI
    tests: [
        "http://sports.pixnet.net/album/video/183041064", // This is one oEmbed.video with a <script>!
        "http://video.yandex.ua/users/enema-bandit/view/11/?ncrnd=4917#hq",  //oEmbed.video - iframe
        "http://talent.adweek.com/gallery/ASTON-MARTIN-Piece-of-Art/3043295", //Behance oEmbed rich
        "http://www.behance.net/gallery/REACH/8080889", // Behance default, with '100%' height
        "http://list.ly/list/303-alternatives-to-twitter-bootstrap-html5-css3-responsive-framework" //oembed rich reader
    ]

};