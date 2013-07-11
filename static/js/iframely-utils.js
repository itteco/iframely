(function() {

    var $ = window.$ = window.$ || {};

    $.iframely = $.iframely || {};

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

    var windowId;
    var heightGetter;

    XD.receiveMessage(function(e) {

        if (e.data.method == "register") {
            windowId = e.data.windowId;

            var height;

            function resize() {
                var h = heightGetter ? heightGetter() : null;

                if (h && h != height && (h > height || !height)) {
                    height = h;
                    XD.postMessage({
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