module.exports = {

    prepareLink: function(link) {
        // Convert specific option messages into `options`
        if (link.message && /(\w+(?:=|\.)\w+)\s?:\s?(.+)$/i.test(link.message) && !link.options) {

            var m = link.message.match(/(\w+(?:=|\.)\w+)\s?:\s?(.+)$/i);


            if (m) {
                delete link.message;

                link.options = {};
                link.options[m[1]] = m[2];
            }
        }
    }
};