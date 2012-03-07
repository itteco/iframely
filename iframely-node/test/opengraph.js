(function() {

    var assert = require('assert');
    var vows = require('vows');

    var iframely = require('../iframely.js');

    vows.describe('Tests')
    .addBatch({
        'Query YouTube Open Graph': {
            topic: function() {
                iframely.queryOpenGraph('http://www.youtube.com/watch?v=-bZ6Pl7cQAE&feature=related', this.callback);
            },
            'is valid': function(err, og) {
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
        },
        'Query Vimeo Open Graph': {
            topic: function() {
                iframely.queryOpenGraph('http://vimeo.com/8005491', this.callback);
            },
            'is valid': function(err, og) {
                assert.isNull(err);
                assert.deepEqual(og, {
                    image: 'http://b.vimeocdn.com/ts/361/934/36193460_640.jpg',                                                                                                    
                    description: 'Homeless-led organization Picture the Homeless rally outside JP Morgan Chase headquarters in Manhattan.  Produced by Housing is a Human Right http://housingisahumanright.org  You can find us on Facebook at https://www.facebook.com/HousingisaHumanRight  and...',                                               
                    site_name: 'Vimeo',                                                                                                                                            
                    count: '3018',                                                                                                                                                 
                    video: {                                                                                                                                                       
                        height: 480,                                                                                                                                               
                        width: 640,                                                                                                                                                
                        type: 'application/x-shockwave-flash',                                                                                                                     
                        url: 'http://vimeo.com/moogaloop.swf?clip_id=8005491'                                                                                                      
                    },                                                                                                                                                             
                    type: 'article',                                                                                                                                               
                    title: 'Picture the Homeless Chasing Chase',                                                                                                                   
                    url: 'http://vimeo.com/8005491'
                });
            }
        }
    })['export'](module);
})();
