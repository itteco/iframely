module.exports = {

    prepareLink: function(link, options) {

        var sslProtocol = link.href && link.href.match(/^(https:)?\/\//i);
        var isPureHtml = link.html || link.template || link.template_context;
        var hasSSL = link.rel.indexOf('ssl') > -1;

        if (hasSSL && !sslProtocol && !isPureHtml) {
            var sslIdx = link.rel.indexOf("ssl");
            link.rel.splice(sslIdx, 1);
            hasSSL = false;
        }

        if (sslProtocol && !hasSSL) {
            link.rel.push('ssl');
        }
    }
};