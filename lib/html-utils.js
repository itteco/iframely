(function() {

    var $ = require('cheerio');
    var _ = require('underscore');

    var defaultPaddingBottom = 100 / CONFIG.DEFAULT_ASPECT_RATIO;

    function wrapContainer($element, data, options) {

        var aspectWrapperClass = options && options.aspectWrapperClass;
        var maxWidthWrapperClass = options && options.maxWidthWrapperClass;
        var omitInlineStyles = options && options.omitInlineStyles;
        var forceWidthLimitContainer = options && options.forceWidthLimitContainer;
        var forceRenderDefaultAspect = options && options.forceRenderDefaultAspect;

        var media = data.media;

        if (!forceWidthLimitContainer && media) {

            if (media.height && media.width && !media["aspect-ratio"]) {
                $element.attr('width', media.width);
                $element.attr('height', media.height);
                return $element;
            }

            if (media.height && !media.width && !media["aspect-ratio"]) {
                $element.css('width', '100%');
                $element.css('height', media.height + 'px');
                return $element;
            }
        }

        var $container = $('<div>')
            .append($element);

        if (aspectWrapperClass) {
            $container.addClass(aspectWrapperClass);
        }

        var $widthLimitContainer;

        var isPlayer = data.rel && data.rel.indexOf(CONFIG.R.player) > -1;
        var verticalAspect = isPlayer && media && media["aspect-ratio"] && media["aspect-ratio"] <= CONFIG.MAX_VERTICAL_ASPECT_RATIO;

        var hasMaxWidth = media && (media["max-width"] || media["min-width"] || media["width"] || verticalAspect);

        if (hasMaxWidth || forceWidthLimitContainer) {
            $widthLimitContainer = $('<div>')
                .append($container);
        }

        if (maxWidthWrapperClass && $widthLimitContainer) {
            $widthLimitContainer.addClass(maxWidthWrapperClass);
        }

        var needDefaultAspect = !media || (!media.height && !media["aspect-ratio"]);

        if (!omitInlineStyles) {

            $element.css('top', '0')
                .css('left', '0')
                .css('width', '100%')
                .css('height', '100%')
                .css('position', 'absolute');

            $container.css('left', '0')
                .css('width', '100%')
                .css('height', '0')
                .css('position', 'relative');

            // Default aspect ratio.
            if (needDefaultAspect) {
                $container.css('padding-bottom', Math.round(10000 * defaultPaddingBottom) / 10000 + '%');
            }

        } else {
            // Hide border: 0 for iframe, if inlineStyles used.
            $element.css('border', '');
            // Clear 'style' attribute if empty string.
            if (!$element.attr('style')) {
                !$element.removeAttr('style');
            }

            // Default aspect ratio.
            if (forceRenderDefaultAspect && needDefaultAspect) {
                $container.css('padding-bottom', Math.round(10000 * defaultPaddingBottom) / 10000 + '%');
            }
        }

        if (media) {
            if (media["aspect-ratio"] || (!media.height && !media.width)) {

                var paddingBottom;

                if (media["aspect-ratio"]) {
                    paddingBottom = Math.round(10000 * 100 / media["aspect-ratio"]) / 10000;
                } else {
                    paddingBottom = defaultPaddingBottom;
                }

                var defaultAspectDeclared = omitInlineStyles;
                var defaultAspectUsed = Math.abs(paddingBottom - defaultPaddingBottom) < 0.1;

                if (defaultAspectDeclared && defaultAspectUsed && !forceRenderDefaultAspect) {
                    // Do not set 'padding-bottom' if not needed.
                } else {
                    $container.css('padding-bottom', paddingBottom + '%');
                }

                if (media["padding-bottom"]) {
                    $container.css('padding-top', media["padding-bottom"] + 'px');
                }

            } else {

                if (media.height) {
                    $container.css('height', media.height + 'px');
                    if (aspectWrapperClass) {
                        $container.css('padding-bottom', '0');
                    }
                }

                if (media.width) {
                    $widthLimitContainer.css('width', media.width + 'px');
                }
            }

            // Min/max width can be controlled by one more parent div.


            if (media["max-width"]) {

                $widthLimitContainer.css("max-width", media["max-width"] + 'px');

            } else if (verticalAspect) {
                // Limit for vertical aspect.
                $widthLimitContainer.css("max-width", Math.round(media["aspect-ratio"] * 100) + 'vh');
            }

            if (media["min-width"]) {
                $widthLimitContainer.css("min-width", media["min-width"] + 'px');
            }
        }

        return $widthLimitContainer || $container;
    }

    var renders = {
        "javascript": {
            test: function(data) {
                return /(text|application)\/javascript/i.test(data.type)
                    && data.href;
            },
            generate: function(data) {
                return '<script type="' + data.type + '" src="' + data.href + '"></script>';
            }
        },
        "image": {
            test: function(data) {
                return /^image(\/[\w\.-]+)?$/i.test(data.type)
                    && data.href;
            },
            generate: function(data) {
                var $img = $('<img>')
                    .attr('src', data.href);
                if (data.title) {
                    $img
                        .attr('title', data.title)
                        .attr('alt', data.title);
                }
                // TODO: add image width, height?
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

                var givf = data.rel.indexOf('gifv') > -1;
                var autoplay = data.rel.indexOf('autoplay') > -1 || givf;

                var $video = $('<video' + (givf ? ' loop muted webkit-playsinline' : ' controls') + (autoplay ? ' autoplay' : '') + '>Your browser does not support HTML5 video.</video>');

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

                    var hasPromo = filterLinks(iframelyData.links, function(link) {
                        return link.rel.indexOf('promo') > -1;
                    }).length;

                    // Find images with same aspect.
                    var thumbnails = filterLinks(iframelyData.links, function(link) {

                        if (hasPromo && link.rel.indexOf('promo') === -1) {
                            return;
                        }

                        if (renders["image"].test(link) && (link.rel.indexOf('thumbnail') > -1 || link.rel.indexOf('image') > -1) && link.type.indexOf('gif') === -1 && !link.href.match(/\.gif(?:[#\?].*)?$/i)) {
                            var m = link.media;
                            if (aspect && m && m.width && m.height) {
                                var imgAspect = m.width / m.height;
                                return Math.abs(imgAspect - aspect) < CONFIG.ASPECT_RATIO_PRECISION;
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
                    return wrapContainer($video, data, options);
                }
            }
        },
        "flash": {
            test: function(data) {
                return data.type === "application/x-shockwave-flash" && data.href;
            },
            generate: function(data, options) {

                var $embed = $('<embed>')
                    .attr('src', data.href)
                    .attr('type', 'application/x-shockwave-flash');

                if (options && options.disableSizeWrapper) {
                    return $embed;
                } else {
                    return wrapContainer($embed, data, options);
                }
            }
        },
        "iframe": {
            test: function(data) {
                return data.type === "text/html" && data.href;
            },
            generate: function(data, options) {

                var $iframe = $('<iframe>')
                    .attr('src', data.href)
                    .css('border', '0')
                    .attr('allowfullscreen', '');


                if (data.media && data.media.scrolling === 'no') {
                    $iframe.attr('scrolling', 'no');
                }

                if (options && options.iframeAttributes) {
                    for(var key in options.iframeAttributes) {
                        $iframe.attr(key, options.iframeAttributes[key]);
                    }
                }

                if (options && options.disableSizeWrapper) {
                    return $iframe;
                } else {
                    return wrapContainer($iframe, data, options);
                }
            }
        },
        "inline": {
            test: function(data) {
                return data.type === "text/html"
                    && !data.href
                    && data.html;
            },
            generate: function(data, options) {
                return data.html;
            }
        }
    };

    exports.generateElementWrapperHtml = function(element, link, options) {

        if (typeof element === 'string') {
            element = $(element);
        }

        var $el = wrapContainer(element, link, options);
        return $('<div>').append($el).html();
    };

    exports.generateLinkElementHtml = function(link, options) {
        var $el = generateLinkElement(link, options);
        if (_.isString($el)) {
            return $el;
        } else if ($el) {
            if (options && options.canonical && link.href !== options.canonical) {
                $el.attr('data-embed-canonical', options.canonical);
            }
            return $('<div>').append($el).html();
        } else {
            return '';
        }
    };


    var generateLinkElement = function(link, options) {
        for(var key in renders) {
            var render = renders[key];
            if (render.test(link)) {
                return render.generate(link, options);
            }
        }
    };

    var filterLinks = function(links, cb) {

        if (links) {

            if (links instanceof Array) {

                return links.filter(cb);

            } else if (typeof links === 'object') {

                var result = [];

                for(var id in links) {
                    var items = links[id];
                    if (items instanceof Array) {
                        items.forEach(function(item) {
                            if (cb(item)) {
                                result.push(item);
                            }
                        });
                    }
                }

                return result;
            }
        }

        return [];
    };

    exports.filterLinksByRel = function(rel, links, options) {

        var options = options || {};

        if (typeof rel == "string") {
            rel = [rel];
        }

        function isHttps(href) {
            return href.indexOf('//:') == 0 || href.indexOf('https://') == 0;
        }

        var result = filterLinks(links, function(link) {

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

    

    function isPromo(l1) {
        return l1.rel.indexOf(CONFIG.R.promo) > -1;
    }

    function isAspectResponsive(l1) {
        return !(l1.media && (l1.media['width'] || l1.media['height']));
    }

    function isResponsiveFixedHeight(l1) {
        return l1.media && !l1.media['width'] && l1.media['height'];
    }

    function getResponsiveGenericWeight(l1, options) {
        if (options.horizontal_first) {
            if (isResponsiveFixedHeight(l1)) return 0;
            if (isAspectResponsive(l1)) return 1;
        } else {
            if (isAspectResponsive(l1)) return 0;
            if (isResponsiveFixedHeight(l1)) return 1;
        }
        return 2;
    }

    function isNonHtml5Video(l1, options) {
        if (options.mp4_first) {
            // Reverse logic.
            return l1.type.indexOf('video/') === 0;
        } else {
            return l1.type.indexOf('video/') !== 0;
        }
    }

    function isNonAutoplay(l1, options) {
        if (options.autoplay_first) {
            // Reverse logic.
            return l1.rel.indexOf(CONFIG.R.autoplay) > -1;
        } else {
            return l1.rel.indexOf(CONFIG.R.autoplay) === -1;
        }
    }

    function isHttps(l1) {
        return l1.href && l1.href.match(/^(https:)?\/\//i);
    }

    function isNotFlash(l1) {
        return l1.type !== CONFIG.T.flash;
    }

    function isTextHtml(l1) {
        return l1.type === CONFIG.T.text_html;
    }

    function isPlayer(l1) {
        return l1.rel.indexOf(CONFIG.R.player) > -1;
    }

    function hasOptions(l1) {
        return !!l1.options;
    }

    function boolToInt(cb) {
        return function(link, options) {
            var result = cb(link, options);
            // True value goes first.
            return result ? 0 : 1;
        }
    }

    // In priority order.
    var comparators = [
        boolToInt(isPromo),
        getResponsiveGenericWeight,
        boolToInt(isResponsiveFixedHeight),
        boolToInt(isNonHtml5Video),
        boolToInt(isNonAutoplay),
        boolToInt(isHttps),
        boolToInt(isNotFlash),
        boolToInt(isTextHtml),
        boolToInt(isPlayer),
        boolToInt(hasOptions)
    ];

    // Good link selection.

    var sortLinks = exports.sortLinks = function(links, autoplay_first, horizontal_first, mp4_first) {

        var options = {
            autoplay_first: autoplay_first, 
            horizontal_first: horizontal_first, 
            mp4_first: mp4_first
        };

        function sortLinksInner(l1, l2) {

            var i = 0;

            while (i < comparators.length) {

                var comparator = comparators[i];

                var c1 = comparator(l1, options);
                var c2 = comparator(l2, options);
                var d = c1 - c2;
                if (d) {
                    // d == -1
                    // d == 1
                    return d;
                }    

                i++;
            }

            return 0;
        }

        links.sort(sortLinksInner);
    };

    function getImage(iframely_data) {

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

    function getPlayer(iframely_data, options) {

        var html5video = false;

        function findPlayer(l) {

            if (!l.href) {
                return;
            }

            if (l.rel.indexOf('inline') > -1) {
                return;
            }

            // In autoplayMode return autoplay (in priority) or non autoplay.
            // In non autoplayMode return non autoplay only.
            if (!options.autoplayMode && l.rel.indexOf('autoplay') > -1) {
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
            sortLinks(iframely_data.links, options.autoplayMode);
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
                    if (player.rel.indexOf('app') > -1 && (image = getImage(iframely_data))) {
                        return image;
                    }
                }
            }
            return player;
        }
    }

    function getInlineApp(iframely_data) {
        return iframely_data && _.find(iframely_data.links, function(l) {
            return l.html && l.type === 'text/html';
        });
    }

    exports.findMainLink = function(iframely_data, options) {

        var selectedLink;

        if (iframely_data) {
            if (selectedLink = getPlayer(iframely_data, options)) {
                // Nop.
            } else if (selectedLink = getImage(iframely_data)) {
                // Nop.
            } else if (selectedLink = getInlineApp(iframely_data)) {
                // Nop.
            }
        }

        return selectedLink;
    };

})();