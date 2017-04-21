module.exports = {

    prepareLink: function(link) {

        if (link.href && link.type === CONFIG.T.text_html && link.rel.indexOf('player') > -1 && link.media && link.media['aspect-ratio'] && !link.media.scrolling) {

            link.media.scrolling = 'no';
        }
    }
};