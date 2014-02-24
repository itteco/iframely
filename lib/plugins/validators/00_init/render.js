var pluginLoader = require('../../../loader/pluginLoader'),
    templates = pluginLoader._templates;

module.exports = {
    prepareLink: function(link, pluginId) {

        if (!link.href && (link.template || link.template_context)) {

            var template = link.template || pluginId;

            if (!(template in templates)) {
                console.error("No template found: " + JSON.stringify(link, null));
                link.error = "No template found: " + link.template;
                return false;
            }

            link._render = {
                template: templates[template]
            };
        }

    }
};