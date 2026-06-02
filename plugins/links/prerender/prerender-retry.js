export default {

    highestPriority: true,

    getData: function(url, __allowJSRender, cb) {

        if (CONFIG.PRERENDER && CONFIG.PRERENDER_URL && options.user_agent === CONFIG.FB_USER_AGENT
            && !url.startsWith(CONFIG.PRERENDER_URL)) {

            cb({
                retry: {
                    refresh: true, // Refresh meta.
                    prerender: true
                }
            });
        } else {
            return cb();
        }
    }
};
