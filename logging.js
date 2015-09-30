var moment = require('moment');

exports.log = function() {
    var args = Array.prototype.slice.apply(arguments);
    args.splice(0, 0, "--", moment().utc().format("\\[YY-MM-DD HH:mm:ss\\]"));
    console.log.apply(console, args);
};