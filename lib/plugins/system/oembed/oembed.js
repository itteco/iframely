const oembedUtils = require('./oembedUtils');
const cheerio = require('cheerio');

const pxRe = /^([\d\.]+)(?:px)?$/;
const percentRe = /^([\d\.]+)%$/;

function fixOembedIframeAttributes(obj) {
    var result = {};
    for(var key in obj) {
        var value = obj[key];
        if (typeof value === 'string') {
            var m = value.match(pxRe);
            if (m) {
                // Convert string numbers to int.
                value = parseFloat(m[1]);
            } else if (key === 'width' || key === 'height') {
                m = value.match(percentRe);
                if (m) {
                    // Skip % value for width of height.
                    continue;
                }
            }
        }
        result[key] = value;
    }
    return result;
}

function _getOembedIframe(oembed) {
    if (!oembed.html) {
        return null;
    }

    if (typeof oembed._iframe === 'undefined') {
        var $container = cheerio('<div>');
        try {
            $container.html(oembed.html);
        } catch (ex) {}
        var $iframe = $container.find('iframe');
        if ($iframe.length === 1) {
            oembed._iframe = fixOembedIframeAttributes($iframe[0].attribs);
        } else {
            oembed._iframe = null;
        }
    }

    return oembed._iframe;
}

function getOembedIframe(oembed) {
    return function() {
        return _getOembedIframe(oembed);
    };
}

function getOembedIframeAttr(oembed) {
    return function(attr) {
        var iframe = _getOembedIframe(oembed);
        if (iframe) {
            return iframe[attr];
        }
    };
}

module.exports = {

    provides: ['self', 'oembedError'],

    getData: function(url, oembedLinks, options, cb) {

        var href = oembedLinks[0].href;

        var skip = false, self_endpoint = false;

        if (CONFIG.SKIP_OEMBED_RE_LIST) {
            var i;
            for(i = 0; i < CONFIG.SKIP_OEMBED_RE_LIST.length && !skip; i++) {
                skip = href.match(CONFIG.SKIP_OEMBED_RE_LIST[i]);
            }
        }

        if (CONFIG.SELF_OEMBED_POINT_RE_LIST) {
            var i;
            for(i = 0; i < CONFIG.SELF_OEMBED_POINT_RE_LIST.length && !self_endpoint; i++) {
                self_endpoint = href.match(CONFIG.SELF_OEMBED_POINT_RE_LIST[i]);
            }
        }

        if (skip || self_endpoint) {
            return cb(null);
        }

        oembedUtils.getOembed(href, options, function(error, oembed) {

            if (error) {
                return cb('Oembed error "'+ oembedLinks[0].href + '": ' + error, {
                    oembedError: error
                });
            }

            var result = {
                oembed: Object.assign({
                    getIframe: getOembedIframe(oembed),
                    getIframeAttr: getOembedIframeAttr(oembed)
                }, oembed),
            };

            // If no oEmbed record for the domain - allow to be whitelisted by the oEmbed endpoint domian record.
            if (options.getWhitelistRecord) {
                var currentWhitelistRecord = options.getWhitelistRecord(url, {disableWildcard: true});
                var oembedWhitelistRecord = options.getWhitelistRecord(href, {exclusiveRel: 'oembed'});

                if (oembedWhitelistRecord 
                    && !oembedWhitelistRecord.isDefault 
                    && (!currentWhitelistRecord 
                        || !currentWhitelistRecord.oembed 
                        || currentWhitelistRecord.isDefault)
                    ) {
                    result.whitelistRecord = oembedWhitelistRecord
                }
            }

            cb(null, result);
        });
    }
};