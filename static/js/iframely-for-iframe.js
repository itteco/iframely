;(function ( $ ) {

    /*

     Iframely consumer client lib - for resizing iframes only.

     Versrion 0.5.6

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

})( jQuery );