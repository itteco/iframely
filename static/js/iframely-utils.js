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

    window.onresize = function() {
        resize();
    };

    var windowId;
    var height, width;
    var preventOverloadCount = 0;

    var TEST_INITIAL_HEIGHT_PERIOD = 200;
    var TEST_INITIAL_HEIGHT_DURATION = 30000;

    function resize() {

        var h = heightGetter();
        var w = widthGetter();

        // h > height and w > width needed to prevent circular resize.
        // h != height - facebook gives too big height at start.
        if (h && (h != height || !height || !w || !width || w > width)) {
            height = h;
            width = w;
            windowMessaging.postMessage({
                windowId: windowId,
                method: 'resize',
                height: height
            });
            preventOverloadCount = 0;
        }

        if (preventOverloadCount < TEST_INITIAL_HEIGHT_DURATION / TEST_INITIAL_HEIGHT_PERIOD) {
            preventOverloadCount++;
            setTimeout(resize, TEST_INITIAL_HEIGHT_PERIOD);
        }
    }

    windowMessaging.receiveMessage(function(e, message) {

        if (!windowId && message && message.method && message.method === "register" && message.windowId) {

            windowId = message.windowId;

            // Reset height to force send size.
            height = null;
            preventOverloadCount = 0;

            resize();
        }
    });

    function widthGetter() {
        return window.document.documentElement.scrollWidth;
    }

    function heightGetter() {
        var d = document.getElementById('iframely-content');
        var elHeight = d.scrollHeight;
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