module.exports = {

    getMeta: function(schemaVideoObject) {

        return {
            duration: schemaVideoObject.duration,
            date: schemaVideoObject.uploadDate
        };
    }
};