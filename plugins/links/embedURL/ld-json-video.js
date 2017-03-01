module.exports = {

    provides: 'schemaVideoObject',

    getData: function(meta, whitelistRecord) {

        if (meta['ld-json'] && whitelistRecord.date > new Date(1485530476990)) { // allow to update whitelist

            try {
                var obj = JSON.parse(meta['ld-json']);

                if (obj['@context'] && /schema\.org$/i.test(obj['@context']) && obj['@type'] === 'VideoObject') {
                    return {
                        schemaVideoObject: obj
                    }
                }
            } catch (ex) {
                // just ignore invalid object
            }
        }
    }

    /*
    http://video.eurosport.com/football/who-will-nelson-the-hornbill-pick-to-win-in-france-v-romania_vid809882/video.shtml
    http://video.eurosport.fr/football/coupe-de-france/2015-2016/video-granville-bourg-en-bresse-les-temps-forts_vid471598/video.shtml
    http://video.eurosport.de/tennis/australian-open/2017/australian-open-2017-boris-becker-spricht-klartext-3-grunde-fur-das-aus-von-zverev-gegen-federer_vid954898/video.shtml
    */
};