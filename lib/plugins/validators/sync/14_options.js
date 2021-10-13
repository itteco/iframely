export default {

    prepareLink: function(link) {

        if (link.options) {

            if (Object.keys(link.options).length === 0) {
                delete link.options;
            } else {
                var key; // thanks jslint
                for (key in link.options) {
                    if (typeof link.options[key] !== 'object') { // it's simple value only, let's expand
                        var value = {
                            value: link.options[key],
                            label: key.replace(/_/g, ' ').replace(/(^\w)/, m => m.toUpperCase()) 
                        }
                        link.options[key] = value;
                    }

                    if (!/^_/.test(key)) {
                        link.options['_' + key] = link.options[key];
                        delete link.options[key];
                    }
                }
            }
        }
    }
};