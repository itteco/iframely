export default {

    provides: "iframe",

    getData: function(oembed) {

        if (oembed.getIframe()) {
            return {
                iframe: oembed.getIframe()
            }
        }
    }
};