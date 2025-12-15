export default {

    prepareLink: function(link, url, options) {

        // If domain URL is HTTPS, replace link to https as well.
        if (/^http:\/\//.test(link.href)) {
            var m = url.match(/^(https:\/\/[^\/]+)\//i);
            var sslDomain = m && m[1];
            if (sslDomain && link.href.indexOf(sslDomain.replace('https', 'http')) === 0) {
                link.href = link.href.replace(/^http:\/\//, 'https://');
            }
        }

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

        console.log(12, link)
        if (/^https:\/\/[^\/\?]+:443\/?/.test(link.href)) {
            console.log(23, link)
            link.href = link.href.replace(/^(https:\/\/[^\/\?]+):443/, '$1');
        }
    }
};