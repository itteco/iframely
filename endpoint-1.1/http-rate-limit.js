(function() {

exports.rateLimit = function(keyFunc, limit, time) {
    var countMap = {};
    
    setInterval(function() {
        for (var key in countMap) {
            var value = countMap[key] - limit/10;
            console.log('ww', key, value, limit/10);
            if (value <= 0) delete countMap[key];
            else countMap[key] = value;
        }
    }, time/10);
    
    return function(req, res, next) {
        var key = keyFunc(req);
        var value = countMap[key] || 0;
        value++;
        
        console.log(value, limit, countMap);
        if (value > limit) {
            res.writeHead(429);
            res.end();
            
        } else {
            countMap[key] = value;
            next();
        }
    };
};

exports.header = function(header) {
    return function(req) {
        return req.headers[header] || '';
    };
};

})();
