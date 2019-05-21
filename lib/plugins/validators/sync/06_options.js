module.exports = {

    prepareLink: function(link) {

        if (link.options) {

            if (Object.keys(link.options).length === 0) {
                delete link.options;
            } else {
                var key; // thanks jslint
                for (key in link.options) {
                    if (!/^_/.test(key)) {
                        link.options['_' + key] = link.options[key];
                        delete link.options[key];
                    }
                }
            }
        }
    }
};