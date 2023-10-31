export default {

    prepareLink: function(link) {

        if (link.href && /^image/i.test(link.type)) {

            if (/^\/\//.test(link.href)) {
                link.href = 'https:' + link.href;
            }

            // This is a legacy check, but let's leave it just in case
            if (/^https?:\/\/[^\/]+\/?https?:?\/\//.test(link.href)) { // ex.: https://hbr.org/1966/03/how-to-buysell-professional-services
                link.href = link.href.replace(/^https?:\/\/[^\/]+\/?https?:?\/\//, 'http://');
            }
        }
    }
};