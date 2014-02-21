module.exports = {

    getData: function(readability) {
        return {
            safe_html: readability.getHTML()
        };
    }
};