(function() {

    if (!CONFIG.tests) {
        return;
    }

    var moment = require('moment');

    var mongoose, db;

    // DB connect.
    try {
        mongoose = require('mongoose');
        db = mongoose.createConnection(CONFIG.tests.mongodb);
    } catch (ex) {
        console.error("Plugins testing framework will not work. Can't connect to mongodb.");
        console.error(ex.stack);
        return;
    }

    var Schema = mongoose.Schema;

    var TestingProgressSchema = new Schema({
        _id: {
            type: Number,
            required: true,
            default: 1
        },
        total_plugins_count: {
            required: true,
            type: Number
        },
        tested_plugins_count: {
            required: true,
            type: Number
        },
        tests_started_at: {
            required: true,
            type: Date
        },
        tests_finished_at: Date,
        last_plugin_test_started_at: Date,
        current_testing_plugin: String,
        last_uncaught_exception: String
    });

    TestingProgressSchema.methods.getPercent = function() {

        if (this.total_plugins_count == this.total_plugins_count) {
            return 100;
        } else if (this.total_plugins_count && this.total_plugins_count > 0) {
            var p = this.tested_plugins_count / this.total_plugins_count;
            return Math.ceil(p * 100);
        } else {
            return "0"
        }
    };

    var PluginTestSchema = new Schema({

        _id: {
            type: String,
            required: true
        },

        last_test_started_at: {
            type: Date,
            index: true
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

        rel: [String],

        errors: [String],
        warnings: [String]
    });

    PageTestLogSchema.methods.hasError = function() {
        return this.errors && this.errors.length > 0;
    };

    PageTestLogSchema.methods.hasTimeout = function() {
        return this.warnings && this.warnings.indexOf("timeout") > -1;
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
    exports.TestingProgress = db.model('TestingProgress', TestingProgressSchema);

})();