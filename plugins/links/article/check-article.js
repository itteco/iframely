export default {

    provides: '__is_general_article',

    getData: function(meta, __readabilityEnabled) {

        if (meta.og && (meta.og.type === "article" || meta.og.type === "blog")) {

            return {
                __is_general_article: true
            };
        }
    }
};