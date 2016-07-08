var ejs = require('ejs'),
    fs = require('fs');

var pluginLoader = require('../../../loader/pluginLoader'),
    templates = pluginLoader._templates;

module.exports = {
    prepareLink: function(link, pluginId) {

        if (!link.href && !link.html && (link.template || link.template_context)) {

            var template = link.template || pluginId;

            if (!(template in templates)) {
                console.error("No template found: " + template);
                link.error = "No template found: " + template;
                return false;
            }

            var template = fs.readFileSync(templates[template], 'utf8');
            link.html = ejs.render(template, link.template_context);

            // Remove whitespaces.
            link.html = link.html
                .replace(/[\n\s]+/gi, ' ')
                // Remove spaces after '>'
                .replace(/>\s+/gi, '>');

            delete link.template;
            delete link.template_context;
        }

    }
};