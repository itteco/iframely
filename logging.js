var moment = require('moment');

exports.log = function() {
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

    args.splice(0, 0, "--", moment().utc().format("\\[YY-MM-DD HH:mm:ss\\]:") + process.pid);

    console.log.apply(console, args);
};