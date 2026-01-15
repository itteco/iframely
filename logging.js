import moment from 'moment';
import CONFIG from './config.loader.js';

export default function log() {
    var args = Array.prototype.slice.apply(arguments);

    // Add ip if request provided.
    var request = args[0];
    if (request && request.headers) {
        args.shift();
        var remote_addr = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
        if (remote_addr) {
            args.splice(0, 0, remote_addr, '-');
        }
    }

    if (CONFIG.LOG_DATE_FORMAT) {
        args.splice(0, 0, "--", moment().utc().format(CONFIG.LOG_DATE_FORMAT) + process.pid);
    } else {
        args.splice(0, 0, "--", "pid:" + process.pid);
    }

    console.log.apply(console, args);
};
