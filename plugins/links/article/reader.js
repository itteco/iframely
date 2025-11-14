export default {

    getData: function(articlebody) {
        if (CONFIG.providerOptions?.app?.allow_readability === true && !CONFIG.SKIP_IFRAMELY_RENDERS) {
            return  {
                safe_html: articlebody
            }
        }
    }
};