module.exports = {

    re: require('./facebook.video').re,

    getMeta: function(__allowFBThumbnail, meta) {

        if (meta.ld && meta.ld.videoobject) {
            var duration = eval(
                meta.ld.videoobject.duration || ''
                    .replace('T','')
                    .replace('P','')
                    .replace('H','*3600+')
                    .replace('M','*60+')
                    .replace('S', '+')
                    .slice(0, -1)
            );

            return {
                duration: duration,
                date: meta.ld.videoobject.datepublished,
                views: meta.ld.videoobject.interactioncount
            }
        }

    },

    getLink: function(__allowFBThumbnail, schemaVideoObject) {

        if (schemaVideoObject
            && schemaVideoObject['@type'] === 'VideoObject'
            && schemaVideoObject.thumbnail
            && schemaVideoObject.thumbnail.contenturl
        ) {
            return {
                href: schemaVideoObject.thumbnail.contenturl,
                type: CONFIG.T.image,
                rel: CONFIG.R.thumbnail
            }
        }
    },

    tests: [
        "http://www.facebook.com/photo.php?v=4253262701205&set=vb.1574932468&type=2&theater",
        "https://www.facebook.com/video.php?v=4392385966850",
        "https://business.facebook.com/KMPHFOX26/videos/10154356403004012/",
        "https://www.facebook.com/tv2nyhederne/videos/1657445024271131/?comment_id=1657463030935997",
        "https://www.facebook.com/sugarandsoulco/videos/1484037581637646/?pnref=story",
        "https://www.facebook.com/watch/?v=235613163792499",
        "https://www.facebook.com/watch/?ref=external&v=373114473595228",
        {noFeeds: true}, {skipMixins: ["fb-error"]}
    ]
};