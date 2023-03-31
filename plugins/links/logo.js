export default {

    getLink: function(meta) {

        if (!meta.logo) {
            return;
        }

        var link = {
            href: meta.logo.href || meta.logo,
            type: meta.logo.type || CONFIG.T.image,
            rel: CONFIG.R.logo
        }

        if (meta.logo.color) {
            link.color = meta.logo.color;
        }

        return link;
    }
};