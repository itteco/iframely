import moment from 'moment';
import CONFIG from './config.loader.js';

// Host-injectable logging sink. When iframely is used as a library
// inside another application, the host may call setLogger(l) with a
// logger object ({info, warn, error}) to route every iframely log
// line into its own logging pipeline. Standalone installs never call
// setLogger and keep the classic prefixed console output below.
let sink = null;
export function setLogger(l) {
    sink = l;
}

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

    if (sink) {
        sink.info.apply(sink, args);
        return;
    }

    if (CONFIG.LOG_DATE_FORMAT) {
        args.splice(0, 0, "--", moment().utc().format(CONFIG.LOG_DATE_FORMAT) + process.pid);
    } else {
        args.splice(0, 0, "--", "pid:" + process.pid);
    }

    console.log.apply(console, args);
};
