;(function ( $ ) {

    /*

     Iframely consumer client lib.

     Versrion 0.5.8

     Fetches and renders iframely oebmed/2 widgets.

     */

    var windowMessaging = function(){

        return {
            postMessage : function(message, target_url, target) {

                message = JSON.stringify(message);

                target_url = target_url || '*';

                target = target || window.parent;  // default to parent

                if (window['postMessage']) {
                    // the browser supports window.postMessage, so call it with a targetOrigin
                    // set appropriately, based on the target_url parameter.
                    target['postMessage'](message, target_url.replace( /([^:]+:\/\/[^\/]+).*/, '$1'));

                }
            },

            receiveMessage : function(callback) {

                function cb(e) {
                    var message;
                    try {
                        message = JSON.parse(e.data);
                    } catch (ex) {
                    }

                    callback(e, message);
                }

                // browser supports window.postMessage
                if (window['postMessage']) {
                    if (window['addEventListener']) {
                        window[callback ? 'addEventListener' : 'removeEventListener']('message', cb, !1);
                    } else {
                        window[callback ? 'attachEvent' : 'detachEvent']('onmessage', cb);
                    }
                }
            }
        };
    }();

    $.ajaxPrefilter('script', function(options) {
        if (options.url.indexOf("reader.js") > -1) {
            options.cache = true;
        }
    });

    $.iframely = $.iframely || {};
    $.iframely.iframes = $.iframely.iframes || {};

    windowMessaging.receiveMessage(function(e, message) {
        var $iframe;
        if (message && message.windowId && ($iframe = $.iframely.iframes[message.windowId])) {
            if ($.iframely.setIframeHeight && message.method === "resize" && message.height) {
                $.iframely.setIframeHeight($iframe, message.height);
            }
        }
    });

    $.iframely.setIframeHeight = function($iframe, height) {

        var $parent = $iframe.parents('.iframely-widget-container');

        if ($parent.length > 0) {

            $parent
                .css('padding-bottom', '')
                .css('height', height);

        } else {
            $iframe.css('height', height);
        }
    };

    $.iframely.registerIframesIn = function($parent) {

        $parent.find('iframe.iframely-iframe').each(function() {

            var $iframe = $(this);

            if ($iframe.attr('iframely-registered')) {
                return;
            }

            $iframe.attr('iframely-registered', true);

            $iframe.load(function() {

                var iframesCounter = $.iframely.iframesCounter = ($.iframely.iframesCounter || 0) + 1;

                $.iframely.iframes[iframesCounter] = $iframe;
                windowMessaging.postMessage({
                    method: "register",
                    windowId: iframesCounter
                }, '*', this.contentWindow);
            });
        });
    };

    $.iframely.getPageData = function(uri, options, cb) {

        if (typeof options === "function") {
            cb = options;
            options = {};
        }

        options = options || {};

        $.ajax({
            url: $.iframely.defaults.endpoint,
            dataType: "json",
            data: {
                uri: uri,
                debug: options.debug,
                mixAllWithDomainPlugin: options.mixAllWithDomainPlugin,
                refresh: options.refresh,
                meta: options.meta,
                whitelist: options.whitelist
            },
            success: function(data, textStatus, jqXHR) {
                cb(null, data, jqXHR);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                var responseJSON = function(){
                    try {
                        return JSON.parse(jqXHR.responseText)
                    } catch(e){};
                }();
                cb(textStatus, responseJSON, jqXHR);
            }
        });
    };

    $.iframely.defaults = {
        endpoint: "//iframely.com/iframely"
    };

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
                return $('<script>')
                    .addClass("iframely-widget iframely-script")
                    .attr('type', data.type)
                    .attr('src', data.href);
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
        }
    };

    $.iframely.generateLinkElement = function(link, options) {

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

    $.iframely.findBestFittedLink = function(targetWidth, targetHeight, links) {

        if (!links || links.length == 0) {
            return;
        }

        var sizedLinks = links.filter(function(link) {
            var media = link.media;
            return media && media.width && media.height;
        });

        if (sizedLinks.length == 0) {
            return links[0];
        }

        var targetAspect = targetWidth / targetHeight;

        var fits = [];
        sizedLinks.forEach(function(link) {

            var width = link.media.width;
            var height = link.media.height;

            var aspect = width / height;
            var scale;

            if (aspect > targetAspect) {
                scale = width / targetWidth;
            } else {
                scale = height / targetHeight;
            }

            if (scale > 1) {
                width = width / scale;
                height = height / scale;
            }

            var diffSquare = targetWidth * targetHeight - width * height;

            fits.push({
                link: link,
                scale: scale,
                modScale: scale > 1 ? scale : 1 / scale,
                diffSquare: diffSquare
            });
        });

        // Check images smaller then screen.
        var smallFit;
        var smallFits = fits.filter(function(fit) {
            return fit.scale <= 1;
        });
        if (smallFits.length > 0) {
            smallFits.sort(function(a, b) {
                return b.scale - a.scale;
            });
            smallFit = smallFits[0];
        }

        // Check images larger then screen.
        var bigFit;
        var bigFits = fits.filter(function(fit) {
            return fit.scale > 1;
        });
        if (bigFits.length > 0) {
            bigFits.sort(function(a, b) {
                // Sort by smallest black square.
                var result = a.diffSquare - a.diffSquare;
                if (result == 0) {
                    // Sort by smallest square
                    result = a.scale - b.scale;
                }
                return result;
            });
            bigFit = bigFits[0];
        }

        // Select closest to 100% scale from smallFit and bigFit.
        var results = [smallFit, bigFit].filter(function(fit) {
            return fit;
        });
        results.sort(function(a, b) {
            return a.modScale - b.modScale;
        });

        return results[0].link;
    };

    // This not works with scaling. Not used yet.
    $.iframely.findBestSizedLink = function(targetWidth, targetHeight, links) {

        if (!links || links.length == 0) {
            return;
        }

        var sizedLinks = links.filter(function(link) {
            var media = link.media;
            return media && media.width && media.height;
        });

        if (sizedLinks.length == 0) {
            return links[0];
        }

        var fits = [];
        sizedLinks.forEach(function(link) {
            var width = link.media.width;
            var height = link.media.height;

            var widthDiff = width - targetWidth;
            var heightDiff = height - targetHeight;

            var overSquare = 0, lostSquare = 0;

            if (widthDiff > 0 && heightDiff > 0) {
                overSquare = width * height - targetWidth * targetHeight;
            }

            if (widthDiff < 0 && heightDiff < 0) {
                lostSquare = targetWidth * targetHeight - width * height;
            }

            if (widthDiff > 0 && heightDiff < 0) {
                overSquare = widthDiff * height;
                lostSquare = - heightDiff * targetWidth;
            }

            if (widthDiff < 0 && heightDiff > 0) {
                overSquare = heightDiff * width;
                lostSquare = - widthDiff * targetHeight;
            }

            fits.push({
                link: link,
                overSquare: overSquare,
                lostSquare: lostSquare
            });
        });

        // Full fit cases, find smalest image.
        var fullFits = fits.filter(function(fit) {
            return fit.lostSquare == 0;
        });
        if (fullFits.length > 0) {
            fullFits.sort(function(a, b) {
                return a.overSquare - b.overSquare;
            });

            return fullFits[0].link;
        }

        // Partial fit cases, find less image loss.
        var partialFits = fits.filter(function(fit) {
            return fit.lostSquare > 0;
        });
        partialFits.sort(function(a, b) {
            return a.lostSquare - b.lostSquare;
        });

        return partialFits[0].link;
    };

    $.iframely.filterLinksByRel = function(rel, links, options) {

        var options = options || {};

        if (typeof rel == "string") {
            rel = [rel];
        }

        function isHttps(href) {
            return /^(?:https:)?\/\/.+/i.test(href);
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

})( jQuery );
