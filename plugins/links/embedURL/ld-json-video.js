module.exports = {

    provides: 'schemaVideoObject',

    getData: function(ld, whitelistRecord) {

        if (whitelistRecord.date > new Date(1485530476990)) { // allow to update whitelist

            if (ld.VideoObject) {
                return {
                    schemaVideoObject: ld.VideoObject
                }
            }
        }
    }

    /*
    http://video.eurosport.com/football/who-will-nelson-the-hornbill-pick-to-win-in-france-v-romania_vid809882/video.shtml
    http://video.eurosport.fr/football/coupe-de-france/2015-2016/video-granville-bourg-en-bresse-les-temps-forts_vid471598/video.shtml
    http://video.eurosport.de/tennis/australian-open/2017/australian-open-2017-boris-becker-spricht-klartext-3-grunde-fur-das-aus-von-zverev-gegen-federer_vid954898/video.shtml
    */
};