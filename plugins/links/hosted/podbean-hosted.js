module.exports = {

    getData: function(video_src) {
        
        if (/^https?:\/\/(?:www\.)?podbean\.com\/media\/player\/[^?]+/i.test(video_src)) {            
            
            return {
                __promoUri: {url: video_src.replace(/\/media\/player\//i, '/media/share/pb-').replace(/(?:\-pb)?(?:\?.+)?$/, '')} // no 'promo' rel required
            }

        } 
    }

    // http://audio.javascriptair.com/e/032-jsair-publishing-javascript-packages-with-john-david-dalton-stephan-bonnemann-james-kyle-and-henry-zhu/
    // http://www.cafecomvelocidade.com.br/e/para-que-serve-a-pre-temporada-da-formula-1-dos-dias-atuais/

};