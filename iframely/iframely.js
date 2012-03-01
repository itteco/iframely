(function(iframely) {

var httpLink = require('http-link');

/**
 * Get oembed for the given url via XHR
 * @param {String} url The page url
 * @param {Object} [options] The request options
 * @param {Function} callback Completion callback function.
 */
var twoStepsProvider_getOembed = function(url, options, callback) {
    if (typeof options == 'function') {
        callback = options;
        options = {};
    }
    
    iframely.getOembedLinks(url, function(err, links) {
        if (err) {
            callback(err);
            
        } else {
            links.sort();
            var oembedUrl = links[0].href;
            iframely.getOembedByProvider(oembedUrl, options, callback);
        }
    });
};

/**
 * Get oembed for the given url via server endpoint
 * @param {String} url The page url
 * @param {Object} [options] The request options
 * @param {Function} callback Completion callback function.
 */
var serverProvider_getOembed = function(url, options, callback) {
    if (typeof options == 'function') {
        callback = options;
        options = {};
    }
    
    var params = [];
    params.push('url=' + encodeURIComponent(url));
    if (options.format) params.push('format=' + options.format);
    
    var serverEndpoint = options.serverEndpoint || 'http://iframe.ly/oembed/1';
    
    var oembedUrl = serverEndpoint + '?' + params.join('&');
    iframely.getOembedByProvider(oembedUrl, options, callback);
};

/**
 * @public
 * Fetches oembed links for the given page url
 * @param {String} url The page url
 * @param {Object} [options] The request options
 * @param {Function} callback Completion callback function. The callback gets two arguments (err, links) where links is an array of objects.
 * @example callback(null, [{href: 'http://example.com/oembed?url=http://example.com/article.html', type: 'application/json+oembed'}])
 */
iframely.getOembedLinks = function(url, options, callback) {
    if (typeof options == 'function') {
        callback = options;
        options = {};
    }
    
    request('HEAD', url, function(error, req) {
        if (error) {
            callback(error);

        } else {
            var value = req.getResponseHeader('link');
            if (value) {
                try {
                    var links = httpLink.parse(value).filter(isOembed);
                    if (links.length > 0) {
                        callback(null, links);

                    } else {
                        callback({error: 'not-found'});
                    }

                } catch (e) {
                    callback(e);
                }

            } else {
                callback({error: 'not-found'});
            }
        }
    });
}

/*
 * @public
 * Get oembed by oembed url (not original page)
 * @param {String} oembedUrl The oembed direct url
 * @param {Object} [options] The request options
 * @param {Number} [options.maxwidth] The maximum width of the embedded resource
 * @param {Number} [options.maxheight] The maximum height of the embedded resource
 * @param {Boolean} [options.iframe] Wrap rich content into iframe
 * @param {Function} callback Completion callback function. The callback gets two arguments (err, oembed) where oembed is an object.
 * @example callback(null, {version: '1.0', type: 'rich', html: '...'})
 */
iframely.getOembedByProvider = function(oembedUrl, options, callback) {
    if (typeof options == 'function') {
        callback = options;
        options = {};
    }
    
    if (options.maxwidth) oembedUrl += '&maxwidth=' + options.maxwidth;
    if (options.maxheight) oembedUrl += '&maxheight=' + options.maxheight;
    if (options.iframe) oembedUrl += '&iframe=true';
    
    request('GET', oembedUrl, function(error, req, data) {
        if (error) {
            callback(error);
        
        } else {
            try {
                if (req.responseXML) {
                    data = xmlToOembed(req.responseXML);
                    
                } else {
                    data = JSON.parse(data);
                }

                data._responseText = req.responseText;

            } catch(e) {
                callback({error: true, reason: e.message});
                return;
            }

            callback(null, data);
        }
    });
};

/**
 * @public
 * Get oembed object for the given url
 * @param {String} url The page url
 * @param {Object} [options] The request options
 * @param {String} [options.format] The requested format (json or xml)
 * @param {Number} [options.maxwidth] The maximum width of the embedded resource
 * @param {Number} [options.maxheight] The maximum height of the embedded resource
 * @param {Boolean} [options.iframe] Wrap rich content into iframe
 * @param {String} [options.serverEndpoint] The url to fallback oembed server
 * @param {Function} callback Completion callback function. The callback gets two arguments (err, oembed) where oembed is an object.
 * @example callback(null, {version: '1.0', type: 'rich', html: '...'})
 */
iframely.getOembed = function(url, options, callback) {
    if (typeof options == 'function') {
        callback = options;
        options = {};
    }
    
    twoStepsProvider_getOembed(url, options, function(error, oembed) {
        if (error) {
            serverProvider_getOembed(url, options, callback);
            
        } else {
            callback(error, oembed);
        }
    });
};

/**
 * @private
 */
var htmlProviders = {
    'rich': function(url, data) {
        return data.html;
    },
    'photo': function(url, data) {
        if (data.html)
            return data.html;
        return '<img src="' + data.url + '" width="' + data.width + '" height="' + data.height + '" alt="' +  + '">';
    },
    'link': function(url, data) {
        if (data.html)
            return data.html;
        return '<a href="' + url + '" target="_blank">' + data.title || url + '</a> '
    },
    'video': function(url, data) {
        return data.html;
    }
};

/**
 * @public
 * Get the html fragment which represent oembed object
 * @param {String} url The url
 * @param {Object} oembed The oembed object
 * @returns The html fragment
 */
iframely.getOembedHtml = function(url, oembed) {
    return htmlProviders[oembed.type](url, oembed)
}

/**
 * @private
 * Convert oembed dom to oembed object
 * @param {Document} xml The oembed DOM
 * @returns {Object} The oembed object
 */
function xmlToOembed(xml) {
    var json = xmlToJson(xml);
    // TODO: validate structure?
    return json.oembed || undefined;
}

/**
 * @private
 */
function xmlToJson(xml) {
    var obj = {};

    if (xml.hasChildNodes()) {
        for(var i = 0; i < xml.childNodes.length; i++) {
            var item = xml.childNodes.item(i);
            var nodeType = item.nodeType;
            var nodeName = item.nodeName;
            if (nodeType == 3 || nodeType  == 4) {
                obj = item.nodeValue;
            } else {
                obj[nodeName] = xmlToJson(item);
            }
        }
    }
    return obj;
}

/**
 * @private
 */
function isOembed(link) {
    return link.type === 'application/json+oembed' || link.type === 'application/xml+oembed' || link.type === 'text/xml+oembed';
}

/**
 * @private
 */
function request(method, url, callback) {
    var req = new XMLHttpRequest();
    req.open(method, url, true);
    req.onload = function() {
        if (req.status == 200) {
            callback(null, req, req.response);
        
        } else {
            callback({error: true, code: req.status});
        }
    };
    req.onerror = function(e) {
        callback({error: true});
    };
    req.send();
}

})(exports);
