var $ = require('cheerio');
var _ = require('underscore');

function wrapContainer($element, data) {

    var media = data.media;

    if (media && media.height && media.width) {
        $element.attr('width', media.width);
        $element.attr('height', media.height);
        return $element;
    }

    $element.css('top', 0)
        .css('left', 0)
        .css('width', '100%')
        .css('height', '100%')
        .css('position', 'absolute');

    var $container = $('<div>')
        .addClass("iframely-widget-container")
        .css('left', 0)
        .css('width', '100%')
        .css('height', 0)
        .css('position', 'relative')
        .append($element);

    // Default aspect ratio.
    if (!media || (!media.height && !media["aspect-ratio"])) {
        $container.css('padding-bottom', '75%');
    }

    if (media) {

        if (media["aspect-ratio"]) {

            $container.css('padding-bottom', Math.round(100 / media["aspect-ratio"]) + '%');

        } else {

            if (media.height) {
                $container.css('height', media.height);
            }

            if (media.width) {
                $container.css('width', media.width);
            }
        }

        // Min/max width can be controlled by one more parent div.
        if (media["max-width"] || media["min-width"]) {
            var $widthLimiterContainer = $('<div>')
                .addClass("iframely-outer-container")
                .append($container);
            ["max-width", "min-width"].forEach(function(attr) {
                if (media[attr]) {
                    $widthLimiterContainer.css(attr, media[attr]);
                }
            });
            $container = $widthLimiterContainer;
        }
    }

    return $container;
}

var renders = {
    "javascript": {
        test: function(data) {
            return /(text|application)\/javascript/i.test(data.type)
                && data.href;
        },
        generate: function(data) {
            return '<script class="iframely-widget iframely-script" type="' + data.type + '" src="' + data.href + '"></script>';
        }
    },
    "image": {
        test: function(data) {
            return /^image(\/[\w-]+)?$/i.test(data.type)
                && data.href;
        },
        generate: function(data) {
            var $img = $('<img>')
                .addClass("iframely-widget iframely-image")
                .attr('src', data.href);
            if (data.title) {
                $img
                    .attr('title', data.title)
                    .attr('alt', data.title);
            }
            // TODO: add image width, heigth?
            return $img;
        }
    },
    "mp4video": {
        test: function(data) {
            return (data.type == "video/mp4"
                || data.type == "video/webm"
                || data.type == "video/ogg");
        },
        generate: function(data, options) {

            var iframelyData = options && options.iframelyData;

            var $video = $('<video controls>Your browser does not support HTML5 video.</video>')
                .addClass("iframely-widget iframely-video");

            if (iframelyData && iframelyData.links) {

                // Find video aspect.
                var media = data.media;
                var aspect, width;

                if (media) {

                    aspect = media["aspect-ratio"];

                    if (!aspect) {
                        [
                            ["min-width", "min-height"],
                            ["max-width", "max-height"],
                            ["width", "height"]
                        ].forEach(function(dims) {
                                width = media[dims[0]];
                                var height = media[dims[1]];
                                if (width && height) {
                                    aspect = width / height;
                                }
                            });
                    }
                }

                // Find images with same aspect.
                var thumbnails = iframelyData.links.filter(function(link) {
                    if (renders["image"].test(link) && (link.rel.indexOf('thumbnail') > -1 || link.rel.indexOf('image') > -1)) {
                        var m = link.media;
                        if (aspect && m && m.width && m.height) {
                            var imgAspect = m.width / m.height;
                            return Math.abs(imgAspect - aspect) < 0.1;
                        }
                        return true;
                    }
                });

                // Find largest image.
                thumbnails.sort(function(a, b) {
                    var w1 = a.media && a.media.width;
                    var w2 = b.media && b.media.width;
                    if (w1 == w2) {
                        return 0;
                    }
                    if (w1 && w2) {
                        return w2 - w1;
                    }
                    // Images without size goes last.
                    if (!w1) {
                        return 1;
                    }
                    if (!w2) {
                        return -1;
                    }
                });

                if (thumbnails.length) {
                    $video.attr("poster", thumbnails[0].href);
                }
            }

            $video.append('<source />')
                .children('source')
                .attr('src', data.href)
                .attr('type', data.type);

            if (options && options.disableSizeWrapper) {
                return $video;
            } else {
                return wrapContainer($video, data);
            }
        }
    },
    "iframe": {
        test: function(data) {
            return (data.type == "text/html"
                || data.type == "application/x-shockwave-flash")
                && data.href;
        },
        generate: function(data, options) {

            var $iframe = $('<iframe>')
                .addClass("iframely-widget iframely-iframe")
                .attr('src', data.href)
                .attr('frameborder', '0')
                .attr('allowfullscreen', true)
                .attr('webkitallowfullscreen', true)
                .attr('mozallowfullscreen', true);

            if (options && options.disableSizeWrapper) {
                return $iframe;
            } else {
                return wrapContainer($iframe, data);
            }
        }
    },
    "inline": {
        test: function(data) {
            return data.type === "text/html"
                && data.rel.indexOf('inline') > -1
                && !data.href
                && data.html;
        },
        generate: function(data, options) {
            return $(data.html);
        }
    }
};

var generateLinkElement = function(link, options) {

    // Backward compatibility with v.0.5.1.
    if (options && options.links) {
        options = {
            iframelyData: options
        };
    }


    for(var key in renders) {
        var render = renders[key];
        if (render.test(link)) {
            return render.generate(link, options);
        }
    }
};

var filterLinksByRel = function(rel, links, options) {

    var options = options || {};

    if (typeof rel == "string") {
        rel = [rel];
    }

    function isHttps(href) {
        return href.indexOf('//:') == 0 || href.indexOf('https://') == 0;
    }

    var result = links && links.filter && links.filter(function(link) {

        if (options.httpsOnly) {
            if (!isHttps(link.href)) {
                return false;
            }
        }

        var found = false;
        var idx = 0;
        while (!found && idx < rel.length) {
            if (link.rel.indexOf(rel[idx]) > -1) {
                found = true;
            }
            idx++;
        }
        return found;
    });

    if (result && options.httpsFirst) {
        result.sort(function(a, b) {
            var sa = isHttps(a.href);
            var sb = isHttps(a.href);
            if (sa == sb) {
                return 0;
            }

            if (sa && !sb) {
                return -1;
            } else {
                return 1;
            }
        });
    }

    if (result && options.returnOne) {
        if (result.length > 0) {
            return result[0];
        } else {
            return null;
        }
    }

    return result;
};

exports.getOembed = function(uri, data) {

    var oembed = {
        type: 'rich',
        version: '1.0',
        title: data.meta.title
    };

    if (data.meta.author) {
        oembed.author = data.meta.author;
    }
    if (data.meta.author_url) {
        oembed.author_url = data.meta.author_url;
    }
    if (data.meta.site) {
        oembed.provider_name = data.meta.site;
        delete data.meta.site;
    }

    var thumbnails = filterLinksByRel("thumbnail", data.links);
    // Find largest.
    var maxW = 0, thumbnail;
    thumbnails && thumbnails.forEach(function(t) {
        var m = t.media;
        if (m && m.width && m.width > maxW) {
            maxW = m.width;
            thumbnail = t;
        }
    });
    // Or first if no sizes.
    if (!thumbnail && thumbnails && thumbnails.length) {
        thumbnail = thumbnails[0];
    }

    if (thumbnail) {
        oembed.thumbnail_url = thumbnail.href;
        var m = thumbnail.media;
        if (m && m.width && m.height) {
            oembed.thumbnail_width = m.width;
            oembed.thumbnail_height = m.height;
        }
    }

    var link;
    var foundRel = _.find(CONFIG.OEMBED_RELS_PRIORITY, function(rel) {
        link = filterLinksByRel(rel, data.links, {returnOne: true});
        return link;
    });

    var inlineReader = link && _.intersection(link.rel, [CONFIG.R.inline, CONFIG.R.reader]).length == 2;

    if (link && !inlineReader) {
        var m = link.media;
        if (m) {
            if (m.width && m.height) {
                oembed.width = m.width;
                oembed.height = m.height;
            }
        }

        if (foundRel == CONFIG.R.image) {

            oembed.type = "photo";
            oembed.url = link.href;

        } else {
            // "player", "survey", "reader"

            var $el = generateLinkElement(link, {
                iframelyData: data
            });

            if (typeof $el === "string") {
                oembed.html = $el;
            } else {
                var $html = $('<div>').append($el);
                oembed.html = $html.html();
            }

        }

    } else {

        if (link && link.html) {
            oembed.type = "rich";
            oembed.html = link.html;
        } else {
            oembed.type = "link";
            oembed.url = data.meta.canonical || uri;
        }
    }

    for(var key in data.meta) {
        if (!(key in oembed)) {
            oembed[key] = data.meta[key];
        }
    }

    return oembed;
};