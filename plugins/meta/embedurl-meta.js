module.exports = {

	lowestPriority: true,

    getMeta: function(schemaVideoObject) {

        return {
            duration: schemaVideoObject.duration,
            date: schemaVideoObject.uploadDate || schemaVideoObject.datePublished || schemaVideoObject.dateCreated,
            // title and description are useful e.g. for Yahoo! Screen
            title: schemaVideoObject.name,
            description: schemaVideoObject.description
        };
    }
};