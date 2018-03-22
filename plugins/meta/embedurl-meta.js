module.exports = {

	lowestPriority: true,

    getMeta: function(schemaVideoObject) {

        return {
            duration: schemaVideoObject.duration,
            date: schemaVideoObject.uploadDate || schemaVideoObject.datePublished || schemaVideoObject.dateCreated || schemaVideoObject.uploaddate,
            // title and description are useful e.g. for Yahoo! Screen
            title: schemaVideoObject.name,
            description: schemaVideoObject.description,
            views: schemaVideoObject.interactionCount || schemaVideoObject.interactioncount
        };
    }
};