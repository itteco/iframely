module.exports = {

    prepareLink: function(link) {

        if (link.href 
            && (link.type === CONFIG.T.text_html || link.accept === CONFIG.T.text_html 
                || (Array.isArray(link.accept) && link.accept.length == 1 && link.accept.indexOf(CONFIG.T.text_html) >-1)) 
            && link.rel.indexOf('player') > -1 && link.media && link.media['aspect-ratio'] && !link.media.scrolling) {

            link.media.scrolling = 'no';
        }
    }
};