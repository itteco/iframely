export default {

    getLink: function(meta) {

        function findIcons(links, filter) {
            var key, l;

            for(key in meta) {

                if (filter(key)) {

                    l = meta[key];

                    if (!(l instanceof Array)) {
                        l = [l];
                    }

                    l.forEach(function(link) {

                        var m = link.sizes && link.sizes.match(/^(\d+)x(\d+)$/i);

                        var href = link.href;
                        if (typeof link === "string") {
                            href = link;
                        }

                        links.push({
                            href: href,
                            rel: key.split(' ').concat('icon'),
                            type: link.type || CONFIG.T.image,
                            width: m && parseInt(m[1]),
                            height: m && parseInt(m[2])
                        });
                    });
                }
            }
        }

        var links = [];

        // Filter not 'shortcut icon'.
        findIcons(links, function(key) {
            return /icon/i.test(key) && key != 'shortcut icon' && !/ss-svg-icons/i.test(key);
        });

        // Use 'shortcut icon' if no other.
        findIcons(links, function(key) {
            return key == 'shortcut icon';
        });

        // Push default icon if no icons at all.
        if (links.length == 0) {
            links.push({
                href: '/favicon.ico',
                type: CONFIG.T.image,
                rel: CONFIG.R.icon,
                _imageStatus: {
                    forceSyncCheck: true
                }
            });
        }

        return links;
    }
};
