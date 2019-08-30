module.exports = {

    re: [
        /^https?:\/\/vimeo\.com\/moogaloop\.swf\?clip_id=(\d+)/i,
        /^https?:\/\/player\.vimeo\.com\/video\/(\d+)/i
    ],

    // direct link to old swf, for example, 
    // http://vimeo.com/moogaloop.swf?clip_id=8527987&server=vimeo.com&show_title=1&show_byline=1&show_portrait=0&color=00ADEF&fullscreen=1

    getLink: function(urlMatch, cb) {

        cb ({
            redirect: "https://vimeo.com/" + urlMatch[1]
        });
    }

};