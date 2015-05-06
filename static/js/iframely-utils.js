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

        var bars = getSBLive(window);
        var h = heightGetter(bars);
        var w = widthGetter(bars);

        // h > height and w > width needed to prevent circular resize.
        // h != height - facebook gives too big height at start. 
        if (h && h != height && (h != height || !height || !w || w > width)) {
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

            resize();
        }
    });

    // check current presence of H & V scrollbars
    // @return array [ Boolean, Boolean ]
    function getSBLive(w) {
        var d = w.document, c = d.compatMode;
        r = c && /CSS/.test(c) ? d.documentElement : d.body;
        // Nee decimal precision.
        var rect = r.getBoundingClientRect();
        var rectWidth = Math.round(rect.width);
        var rectHeight = Math.round(rect.height);
        if (typeof w.innerWidth == 'number') {
            return [ w.innerHeight > rectHeight, w.innerWidth > rectWidth ];
        } else {
            return [ r.scrollWidth > rectWidth, r.scrollHeight > rectHeight ];
        }
    }

    // get current H & V scrollbars tickness
    // @return array [ Number, Number ]
    function getSBSize(w) {
        var d = w.document, b = d.body, r = [ 0, 0 ], t;
        if (b) {
            t = d.createElement('div');
            t.style.cssText = 'position:absolute;overflow:scroll;top:-100px;left:-100px;width:100px;height:100px;';
            b.insertBefore(t, b.firstChild);
            r = [ t.offsetHeight - t.clientHeight, t.offsetWidth - t.clientWidth ];
            b.removeChild(t);
        }
        return r;
    }

    function widthGetter(bars) {
        var d = window.document, r = d.documentElement;

        var width = r.scrollWidth;

        if (bars[1]) {
            width += getSBSize(window)[1];
        }

        return width;
    }

    function heightGetter(bars) {
        var d = document.getElementById('iframely-content');
        var elHeight = d.scrollHeight;
        var docHeight = document.body.scrollHeight;

        // If has vertical scroller get document height.
        // If has no scroller - get container height.
        var height;
        if (bars[1]) {
            height = docHeight;
        } else {
            height = elHeight;
        }

        // If has horizontal scroller - add scroller height.
        if (bars[0]) {
            height += getSBSize(window)[0];
        }

        return height;
    }

    // Send resize event.
    resize();
})();