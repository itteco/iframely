var utils = require('./utils');

module.exports = {

    getMeta: function(meta) {
        return {
            title: meta["sailthru.title"],
            description: meta["sailthru.description"],
            author: meta["sailthru.author"],
            keywords: meta["sailthru.tags"],
            date: meta["sailthru.date"]
        };
    },

    getLinks: function(meta) {

        return [].concat(
            utils.getImageLink('sailthru.thumb', meta) || [],
            utils.getImageLink('sailthru.image.full', meta) || [],
            utils.getImageLink('sailthru.image.thumb', meta) || [],
            utils.getImageLink('sailthru.playimage', meta) || [],
            utils.getImageLink('sailthru.brandthumbimage', meta) || []
        );
    }
};