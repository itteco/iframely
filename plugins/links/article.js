module.exports = {

	notPlugin:  !(CONFIG.providerOptions.readability && CONFIG.providerOptions.readability.enabled === true),

    getData: function(readability) {
        return {
            safe_html: readability.getHTML()
        };
    }
};