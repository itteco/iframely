var renderPluginTemplate = require('../../../utils').renderPluginTemplate;

var pluginLoader = require('../../../loader/pluginLoader'),
    templates = pluginLoader._templates;

module.exports = {
    prepareLink: function(link, pluginId, options) {

        if (!link.href && !link.html && (link.template || link.template_context)) {

            var template = link.template || pluginId;

            if (!(template in templates)) {
                console.error("No template found: " + template);
                link.error = "No template found: " + template;
                return false;
            }

            if (options.keepRawTemplates) {

                template_context = link.template_context;
                delete link.template_context;

                // Template name to later render.
                link.template_id = template;
                // Template context for render.
                link.template_context = template_context

            } else {

                link.html = renderPluginTemplate(template, link.template_context, templates);

                delete link.template;
                delete link.template_context;
            }
        }

    }
};