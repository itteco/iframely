module.exports = {

    mixins: [
        "*"
    ],

    getLink: function (oembed) {

        var links = [];

        if (oembed.type === "photo") {

            var size_M_src = oembed.url;
            var size_X_src = size_M_src.replace("/M/", "/X3/");

            //thumbnail
            links.push({
                href: size_M_src,
                type: CONFIG.T.image,
                rel: CONFIG.R.thumbnail,
                width: oembed.width,
                height: oembed.height
            });

            //photo
            links.push({
                href: size_X_src,
                type: CONFIG.T.image,
                rel: CONFIG.R.image
            });

        } else if (oembed.type === "rich") {

            // do nothing, it is so broken
            // if they fix it - we'll cover it via whitelist

        } // else it's oembed link with no thumnbnail or other useful info.
        
        return links;
    },

    tests: [
        "http://cedricwalter.smugmug.com/Computers/Joomla/i-726WRdK/A"
    ]
};