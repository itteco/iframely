module.exports = {

    getLink: function(meta) {

        if (!meta.logo) {
            return;
        }

        return {
            href: meta.logo.href || meta.logo,
            type: meta.logo.type || CONFIG.T.image,
            rel: CONFIG.R.logo
        }
    }
};