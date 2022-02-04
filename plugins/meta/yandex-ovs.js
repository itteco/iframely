export default {

    provides: 'ovs',

    getMeta: function(ovs) {

        return {
            date: ovs.upload_date,
            views: ovs.views_total
        }

    },

    getData: function(meta) {

        if (meta.ya && meta.ya.ovs) {
            return {
                ovs: meta.ya.ovs
            }
        }
    }
};