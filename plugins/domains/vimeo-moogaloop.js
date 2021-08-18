module.exports = {

    re: /^https?:\/\/vimeo\.com\/moogaloop\.swf\?clip_id=(\d+)/i,

    // Direct link to old swfs. For example, 
    // http://vimeo.com/moogaloop.swf?clip_id=8527987&server=vimeo.com&show_title=1&show_byline=1&show_portrait=0&color=00ADEF&fullscreen=1

    getLink: function(urlMatch, cb) {
        cb ({
            redirect: "https://vimeo.com/" + urlMatch[1]
        });
    }

};