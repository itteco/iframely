(function() {

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

    var contentElement = document.getElementById('iframely-content');

    var windowId;
    var height, width;

    function resize(force) {

        var h = heightGetter();
        var w = widthGetter();

        // h > height and w > width needed to prevent circular resize.
        // h != height - facebook gives too big height at start.
        if (h && (force || h != height || !height || !w || !width || w > width)) {
            height = h;
            width = w;
            windowMessaging.postMessage({
                windowId: windowId,
                method: 'resize',
                height: height
            });
        }
    }

    window.onresize = function() {
        resize();
    };

    var lastContentElementHeight;
    setInterval(function() {
        var elHeight = contentElement.scrollHeight;
        if (elHeight != lastContentElementHeight) {
            lastContentElementHeight = elHeight;
            resize();
        }
    }, 100);

    windowMessaging.receiveMessage(function(e, message) {

        if (!windowId && message && message.method && message.method === "register" && message.windowId) {

            windowId = message.windowId;

            // Reset height to force send size.
            height = null;

            resize(true);
        }
    });

    function widthGetter() {
        return window.document.documentElement.scrollWidth;
    }

    function heightGetter() {
        var elHeight = contentElement.scrollHeight;
        var docHeight = document.body.scrollHeight;

        var height;
        if (elHeight < docHeight && elHeight > 0) {
            height = elHeight;
        } else {
            height = docHeight;
        }

        return height;
    }

    // Send resize event.
    resize();
})();