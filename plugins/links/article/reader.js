export default {

    getData: function(__readabilityEnabled, articlebody) {
        if (__readabilityEnabled === 'html' && CONFIG.providerOptions?.app?.allow_readability === true && !CONFIG.SKIP_IFRAMELY_RENDERS) {
            return  {
                safe_html: articlebody
            }
        }
    }
};