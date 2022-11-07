export default {

    prepareLink: function(link) {
        // Always add now-deprecated 'html5' rel if missing
        if (link.type === CONFIG.T.text_html && link.rel.indexOf(CONFIG.R.html5) === -1) {
            link.rel.push(CONFIG.R.html5);
        }
    }
};