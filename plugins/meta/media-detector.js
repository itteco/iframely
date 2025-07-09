export default {

    lowestPriority: true,

    getMeta: function(meta, url, whitelistRecord) {

        if (meta.og && /video|movie/i.test(meta.og.type)
            || meta.video_src || meta.video_type
            || meta.medium === 'video') {
            
            return {
                medium: 'video'
            }
        }

        if (meta.og && (/music\.song/i.test(meta.og.type) || meta.og.audio)) {
            return {
                medium: 'audio'
            }           
        }        

        var has_thumbnail = (meta.og && meta.og.image) || (meta.twitter && meta.twitter.image);

        if (has_thumbnail && meta.og 
            && !/\/(?:videos?|player|embed)\//i.test(url) && !/https?:\/\/videos?\./i.test(url)
            && (/article|blog|news|noticia/i.test(url) 
                || (/\/(\d{4})\/(\d{2})\/(\d{2})/).test(url) 
                || /article|post/i.test(meta.og.type) && (!meta.ld || meta.article)
                || (
                    meta.og.video 
                    && whitelistRecord.isDefault 
                    && whitelistRecord.isAllowed 
                    && whitelistRecord.isAllowed('og.video') 
                    && (typeof meta.og.type !== 'string' 
                        || !/video/.test(meta.og.type))
                    )
                )
        ) {

            return {
                medium: 'article'
            }

        } else if (meta.medium) {
            return {
                medium: meta.medium
            }

        // With lowestPririty, let the fallback be "link". It will be overridden by other plugins if needed.
        } else if (meta.og || meta.twitter || meta.ld || meta.dc
            /* homepage */  || /^https:\/\/[^\/]+\/?$/.test(url) && meta.description) {
            
            return {
                medium: 'link'
            }
        }
    }
};