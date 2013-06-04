;(function ( $ ) {

    /*



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
                disableCache: options.disableCache
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
        endpoint: "http://iframe.ly/oembed2"
    };

    var renders = {
        "javascript": {
            test: function(data) {
                return /(text|application)\/javascript/i.test(data.type)
                    && data.href;
            },
            generate: function(data) {
                return $('<script>')
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
                var $img = $('<img>').attr('src', data.href);
                if (data.title) {
                    $img
                        .attr('title', data.title)
                        .attr('alt', data.title);
                }
                return $img;
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
                    .attr('src', data.href)
                    .attr('frameborder', '0');
                var $container = $('<div>')
                    .addClass('oembed-container')
                    .append($iframe);

                var media = data.media;

                if (media && media["aspect-ratio"]) {

                    $container.css('padding-bottom', Math.round(100 / media["aspect-ratio"]) + '%');

                } else {

                    if (media && media.height) {
                        $container.css('height', media.height);
                    }

                    var w;
                    if (media && (w = media.width || media["max-width"] || media["min-width"])) {
                        $container.css('width', w);
                    }

                    // Default aspect ratio.
                    if (!media || (!media.height && !media["aspect-ratio"])) {
                        $container.css('padding-bottom', '75%');
                    }
                }

                return $container;
            }
        },
        'article': {
            test: function(data) {
                return data.type == "text/x-safe-html"
                    && data.html;
            },
            generate: function(data) {
                var $div = $('<div>').html(data.html);
                return $div;
            }
        }
    };

    $.iframely.generateLinkElement = function(data) {

        for(var key in renders) {
            var render = renders[key];
            if (render.test(data)) {
                return render.generate(data);
            }
        }
    };

})( jQuery );