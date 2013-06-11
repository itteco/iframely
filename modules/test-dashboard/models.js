(function() {

    var moment = require('moment');

    var mongoose, db;

    // DB connect.
    try {
        mongoose = require('mongoose');
        db = mongoose.createConnection(CONFIG.tests_mongodb);
    } catch (ex) {
        console.warn("Mongodb not initialized. Test dashboard will not work.");
        return;
    }

    var Schema = mongoose.Schema;

    var PluginTestSchema = new Schema({

        _id: {
            type: String,
            required: true
        },

        // Special urls to test. Can be added manually or by tester when error occurs: to keep url in future sets.
        additional_test_urls: [String],

        // Provider is not in current test providers list.
        obsolete: {
            type: Boolean,
            default: false
        },

        error: String
    });

    var TestUrlsSetSchema = new Schema({

        created_at: {
            type: Date,
            required: true,
            default: Date.now,
            index: true
        },

        plugin: {
            type: String,
            required: true,
            ref: 'PluginTest'
        },

        urls: [String],

        errors: []
    });

    TestUrlsSetSchema.methods.hasError = function() {
        return this.errors && this.errors.length > 0;
    };

    var PageTestLogSchema = new Schema({

        url: {
            type: String,
            required: true
        },

        created_at: {
            type: Date,
            required: true,
            "default": Date.now,
            index: true
        },

        test_set: {
            type: Schema.ObjectId,
            required: true,
            ref: 'TestUrlsSet'
        },

        plugin: {
            type: String,
            required: true,
            ref: 'PluginTest'
        },

        response_time: {
            type: Number,
            required: true
        },

        //data: String,

        errors: [String],
        warnings: [String]
    });

    PageTestLogSchema.methods.hasError = function() {
        return this.errors && this.errors.length > 0;
    };
    PageTestLogSchema.methods.hasWarning = function() {
        return this.warnings && this.warnings.length > 0;
    };

    PageTestLogSchema.methods.created_at_format = function() {
        return moment(this.created_at).format("DD-MM-YY HH:mm");
    };



    exports.PluginTest = db.model('PluginTest', PluginTestSchema);
    exports.PageTestLog = db.model('PageTestLog', PageTestLogSchema);
    exports.TestUrlsSet = db.model('TestUrlsSet', TestUrlsSetSchema);

})();