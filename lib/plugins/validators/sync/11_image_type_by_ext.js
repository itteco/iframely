export default {

    prepareLink: function(link) {

        if (link.type === CONFIG.T.image) {

            var extRe = link.href.match(/\.(\w{3,4})(\?.*)?$/);
            var ext = extRe && extRe[1].toLowerCase() || null;

            if (ext === 'ico') {
                link.type = CONFIG.T.image_icon;
            }
            if (ext === 'png') {
                link.type = CONFIG.T.image_png;
            }
            if (ext === 'svg') {
                link.type = CONFIG.T.image_svg;
            }
            if (ext === 'gif') {
                link.type = CONFIG.T.image_gif;
            }
            if (ext === 'jpg' || ext === 'jpeg') {
                link.type = CONFIG.T.image_jpeg
            }
        }
    }
};