;(function ( $ ) {

    /*

    Iframely consumer client lib.

    Versrion 0.3.10

    Fetches and renders iframely oebmed/2 widgets.

    */

    var XD = function(){

        return {
            postMessage : function(message, target_url, target) {

                target_url = target_url || '*';

                target = target || window.parent;  // default to parent

                if (window['postMessage']) {
                    // the browser supports window.postMessage, so call it with a targetOrigin
                    // set appropriately, based on the target_url parameter.
                    target['postMessage'](message, target_url.replace( /([^:]+:\/\/[^\/]+).*/, '$1'));

                }
            },

            receiveMessage : function(callback) {

                // browser supports window.postMessage
                if (window['postMessage']) {
                    if (window['addEventListener']) {
                        window[callback ? 'addEventListener' : 'removeEventListener']('message', callback, !1);
                    } else {
                        window[callback ? 'attachEvent' : 'detachEvent']('onmessage', callback);
                    }
                }
            }
        };
    }();

    $.iframely = $.iframely || {};
    $.iframely.iframes = $.iframely.iframes || {};

    XD.receiveMessage(function(e) {
        var $iframe;
        if (e.data && e.data.windowId && ($iframe = $.iframely.iframes[e.data.windowId])) {
            if (e.data.method == "resize" && e.data.height) {
                $iframe.parent()
                    .css('padding-bottom', '')
                    .css('height', e.data.height);
            }
        }
    });

    $.iframely.registerIframesIn = function($parent) {
        $parent.find('iframe').each(function() {

            var $iframe = $(this);

            if ($iframe.attr('iframely-registered')) {
                return;
            }

            $iframe.attr('iframely-registered', true);

            $iframe.load(function() {

                var iframesCounter = $.iframely.iframesCounter = ($.iframely.iframesCounter || 0) + 1;

                $.iframely.iframes[iframesCounter] = $iframe;
                XD.postMessage({
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
                refresh: options.refresh
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
        endpoint: "http://iframely.com/iframely"
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
                return $img;
            }
        },
        "mp4video": {
            test: function(data) {
                return (data.type == "video/mp4"
                    || data.type == "video/webm"
                    || data.type == "video/ogg");
            },
            generate: function(data, iframely_data) {
                var $video = $('<video controls>Your browser does not support HTML5 video.</video>')
                    .addClass("iframely-widget iframely-video");

                if (iframely_data && iframely_data.links) {

                    // Find video aspect.
                    var media = data.media;
                    var aspect = media["aspect-ratio"];
                    if (media) {
                        [
                            ["min-width", "min-height"],
                            ["max-width", "max-height"],
                            ["width", "height"]
                        ].forEach(function(dims) {
                            var w = media[dims[0]];
                            var h = media[dims[1]];
                            if (w && h) {
                                aspect = w / h;
                            }
                        });
                    }

                    if (aspect) {
                        // Find images with same aspect.
                        var thumbnails = iframely_data.links.filter(function(link) {
                            if (renders["image"].test(link) && (link.rel.indexOf('thumbnail') > -1 || link.rel.indexOf('image') > -1)) {
                                var m = link.media;
                                if (m && m.width && m.height) {
                                    var imgAspect = m.width / m.height;
                                    return Math.abs(imgAspect - aspect) < 0.1;
                                }
                            }
                        });

                        if (thumbnails.length) {
                            // Find largest image.
                            var maxW = 0, image;
                            thumbnails.forEach(function(link) {
                                if (link.media.width > maxW) {
                                    image = link;
                                }
                            });

                            $video.attr("poster", image.href);
                        }
                    }

                }

                $video.append('<source />').children('source')
                    .attr('src', data.href)
                    .attr('type', data.type);

                return wrapContainer($video, data);
            }
        },
        "iframe": {
            test: function(data) {
                return (data.type == "text/html"
                    || data.type == "application/x-shockwave-flash")
                    && data.href;
            },
            generate: function(data) {

                var $iframe = $('<iframe>')
                    .addClass("iframely-widget iframely-iframe")
                    .attr('src', data.href)
                    .attr('frameborder', '0');

                return wrapContainer($iframe, data);
            }
        }
    };

    $.iframely.generateLinkElement = function(link, allData) {

        for(var key in renders) {
            var render = renders[key];
            if (render.test(link)) {
                return render.generate(link, allData);
            }
        }
    };

})( jQuery );