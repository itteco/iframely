export default {

    notPlugin: true,

    maybeApp: function(meta) {

        const title = (meta.og && meta.og.title) || (meta.twitter && meta.twitter.title) || meta.title || meta['html-title'];
        const maybeApp = 
            meta.fragment === '!' && (/{{.+}}/.test(title) || !meta.og && !meta.twitter)
            || meta.og && !meta.og.title && title && meta.og.site_name === title; // e.g. Medium

        return maybeApp
            || meta['prerender-status-code'] 
            || /^{{.+}}$/.test(title)
    }
};
