(function() {

    var $ = window.$ = window.$ || {};

    $.iframely = $.iframely || {};

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

    var windowId;
    var heightGetter;

    windowMessaging.receiveMessage(function(e, message) {

        if (message && message.method && message.method === "register") {
            windowId = message.windowId;

            var height;

            function resize() {
                var h = heightGetter ? heightGetter() : null;

                if (h && h != height && (h > height || !height)) {
                    height = h;
                    windowMessaging.postMessage({
                        windowId: windowId,
                        method: 'resize',
                        height: height
                    });
                }
            }

            setInterval(resize, 200);
            resize();
        }
    });

    $.iframely.registerHeightGetter = function(f) {
        heightGetter = f;
    };

})();