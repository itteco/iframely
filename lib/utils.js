exports.createTimer = function() {

    var timer = new Date().getTime();

    return function() {
        return new Date().getTime() - timer;
    };
};