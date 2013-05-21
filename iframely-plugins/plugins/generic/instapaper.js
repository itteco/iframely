var $ = require('jquery');

module.exports = {

    getLink: function(instapaper_flag, $selector) {

        var $cont = $('<article />');

        var content = $selector('.instapaper_body');

        content.find('.instapaper_ignore').remove();
        content.find('a[href=], a:not([href])').remove();   // TODO: understand WHY???

        if (content.length) {
            $cont.append(content.children());

            return {
                html: $cont.html(),
                type: CONFIG.T.safe_html,
                rel: [CONFIG.R.reader, CONFIG.R.instapaper]
            }
        }
    }

    // TODO: add tests.

};