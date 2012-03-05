(function() {

var assert = require('assert');
var vows = require('vows');

var iframely = require('../iframely.js');

vows.describe('Tests')
.addBatch({
    'Query opengraph': {
        topic: function() {
            iframely.queryOpenGraph('http://www.youtube.com/watch?v=-bZ6Pl7cQAE&feature=related', this.callback);
        },
        'is array': function(err, og) {
            assert.isNull(err);
            assert.deepEqual(og, {
                url: 'http://www.youtube.com/watch?v=-bZ6Pl7cQAE',
                title: "Секретный приём мастера парковки",
                description: '',
                type: "video",
                image: "http://i2.ytimg.com/vi/-bZ6Pl7cQAE/hqdefault.jpg",
                video: {
                    url: "http://www.youtube.com/v/-bZ6Pl7cQAE?version=3&autohide=1",
                    type: "application/x-shockwave-flash",
                    width: 396,
                    height: 297
                },
                site_name: "YouTube"
            });
        }
    }
})['export'](module);

})();
