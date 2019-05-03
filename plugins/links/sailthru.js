var utils = require('./utils');

module.exports = {

    provides: 'sailthru',

    getMeta: function(sailthru) {
        return {
            title: sailthru.title,
            description: sailthru.description,
            author: sailthru.author,
            keywords: sailthru.tags,
            date: sailthru.date
        };
    },

    getLinks: function(sailthru) {

        return [].concat(
            utils.getImageLink('thumb', sailthru) || [],
            utils.getImageLink('image.full', sailthru) || [],
            utils.getImageLink('image.thumb', sailthru) || [],
            utils.getImageLink('playimage', sailthru) || [],
            utils.getImageLink('author-avatar', sailthru) || [],
            utils.getImageLink('brandthumbimage', sailthru) || []
        );
    },

    getData: function(meta) {
        if (meta.sailthru) {
            return {
                sailthru: meta.sailthru
            }
        }
    }
};