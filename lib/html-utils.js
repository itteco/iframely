(function() {

    var $ = require('cheerio');
    var _ = require('underscore');

    function wrapContainer($element, data) {

        var media = data.media;

        if (media && media.height && media.width && !media["aspect-ratio"]) {
            $element.attr('width', media.width);
            $element.attr('height', media.height);
            return $element;
        }

        $element.css('top', '0px')
            .css('left', '0px')
            .css('width', '100%')
            .css('height', '100%')
            .css('position', 'absolute');

        var $container = $('<div>')
            //.addClass("iframely-widget-container")
            .css('left', '0px')
            .css('width', '100%')
            .css('height', '0px')
            .css('position', 'relative')
            .append($element);

        // Default aspect ratio.
        if (!media || (!media.height && !media["aspect-ratio"])) {
            $container.css('padding-bottom', '75%');
        }

        if (media) {

            if (media["aspect-ratio"]) {

                $container.css('padding-bottom', Math.round(10000 * 100 / media["aspect-ratio"]) / 10000 + '%');

            } else {

                if (media.height) {
                    $container.css('height', media.height + 'px');
                }

                if (media.width) {
                    $container.css('width', media.width + 'px');
                }
            }

            // Min/max width can be controlled by one more parent div.
            if (media["max-width"] || media["min-width"]) {
                var $widthLimiterContainer = $('<div>')
                    //.addClass("iframely-outer-container")
                    .append($container);
                ["max-width", "min-width"].forEach(function(attr) {
                    if (media[attr]) {
                        $widthLimiterContainer.css(attr, media[attr] + 'px');
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
                    //.addClass("iframely-widget iframely-image")
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

                var $video = $('<video controls>Your browser does not support HTML5 video.</video>');

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
                    //.addClass("iframely-widget iframely-iframe")
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
                return data.html;
            }
        }
    };

    exports.generateLinkElementHtml = function(link, options) {
        var $el = generateLinkElement(link, options);
        if (_.isString($el)) {
            return $el;
        } else if ($el) {
            return $('<div>').append($el).html();
        } else {
            return '';
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

    exports.filterLinksByRel = function(rel, links, options) {

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

            if (options && options.excludeRel && link.rel.indexOf(options.excludeRel) > -1) {
                return false;
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


    // Good link selection.

    var findBestFittedLink;
    var sortLinks;
    var generateLinkElementHtml;

    function renderImage(iframely_data) {

        var image, width;

        iframely_data && iframely_data.links && iframely_data.links.forEach(function(l) {

            if ((l.rel.indexOf('image') > -1
                || l.rel.indexOf('file') > -1) && l.type.indexOf('image') === 0) {

                var w = l.media && l.media.width;

                if (w) {
                    if (w > width || !width) {
                        width = w;
                        image = l;
                    }
                } else if (!image) {
                    image = l;
                }
            }
        });

        return image;
    }

    function renderPlayer(iframely_data) {

        var html5video = false;

        function findPlayer(l) {

            if (!l.href) {
                return;
            }

            if (l.rel.indexOf('inline') > -1) {
                return;
            }

            if ((
                l.type == "text/html"
                    ||
                    l.type == "application/x-shockwave-flash"
                )
                && l.href) {
                return true;
            }

            if ((l.type == "video/mp4"
                || l.type == "video/webm"
                || l.type == "video/ogg")
                && l.href) {
                html5video = true;
                return true;
            }
        }

        if (iframely_data) {
            sortLinks(iframely_data.links);
        }

        var player = iframely_data && _.find(iframely_data.links, findPlayer);

        if (player) {

            var m = player.media || {};

            var width = m.width || m['max-width'] || null;
            var height = m.height || m['max-height'] || null;

            var aspect_ratio = m['aspect-ratio'];
            var has_aspect_ratio = !!aspect_ratio;

            if (html5video || player.rel.indexOf('autoplay') > -1) {
                //
            } else {
                if (!has_aspect_ratio && width && height) {
                    var image;
                    if (player.rel.indexOf('app') > -1 && (image = renderImage(link, res, test))) {
                        return image;
                    }
                }
            }
            return player;
        }
    }

    function renderInlineApp(iframely_data) {

        return iframely_data && _.find(iframely_data.links, function(l) {
            return l.html && l.type === 'text/html';
        });
    }

    var makeIframelyHtml = function(iframely_data) {

        var selectedLink;

        if (iframely_data) {
            if (selectedLink = renderPlayer(iframely_data)) {
                // Nop.
            } else if (selectedLink = renderImage(iframely_data)) {
                // Nop.
            } else if (selectedLink = renderInlineApp(iframely_data)) {
                // Nop.
            }
        }

        var html;

        if (selectedLink && selectedLink.html && selectedLink.rel.indexOf('inline') > -1) {
            html = selectedLink.html;
        } else if (selectedLink) {
            html = generateLinkElementHtml(selectedLink, {iframelyData: iframely_data});
        }

        return html;
    };

})();