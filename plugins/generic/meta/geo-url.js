module.exports = {

    getMeta: function(meta) {

        /*
        Example:
    	    "ICBM": "42.88, -78.88",
    	    "geo.position": "42.88;-78.88",
    	Sample: http://qik.com/video/52767028
        */
        var geo = meta.ICBM || meta.geo.position;

        if (geo) {

            var ll = geo.split((/[,;]\s*/));

            if (ll.length == 2)
            return {
                "latitude": ll[0],
                "longitude": ll[1]
            }
        }
    }
}