    import moment from 'moment';
    import mongoose from 'mongoose';
    import CONFIG from '../../config.loader.js';

    mongoose.set('useUnifiedTopology', true);
    mongoose.set('useCreateIndex', true);
    mongoose.set('useNewUrlParser', true);
    if (global.Promise) {
        mongoose.Promise = global.Promise;
    }

    const db = mongoose.createConnection(CONFIG.tests.mongodb);

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

        errors_list: []
    });

    TestUrlsSetSchema.methods.hasError = function() {
        return this.errors_list && this.errors_list.length > 0;
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
            ref: 'TestUrlsSet',
            index: true
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

        errors_list: [String],
        warnings: [String],

        h2: {
            type: Boolean,
            index: true
        }
    });

    PageTestLogSchema.methods.hasError = function() {
        return this.errors_list && this.errors_list.length > 0;
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

    export const PluginTest = db.model('PluginTest', PluginTestSchema);
    export const PageTestLog = db.model('PageTestLog', PageTestLogSchema);
    export const TestUrlsSet = db.model('TestUrlsSet', TestUrlsSetSchema);
    export const TestingProgress = db.model('TestingProgress', TestingProgressSchema);