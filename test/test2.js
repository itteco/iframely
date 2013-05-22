var iframely = require('../lib/iframely-meta');

//var s = "http://habrahabr.ru/post/178509/";
//var s = "http://www.youtube.com/watch?v=etDRmrB9Css";
//var s = "http://qik.com/video/52767028";
//var s = "http://dippoetry.dipdive.com/media/151409";
//var s = "http://korrespondent.net/ukraine/events/1555046-v-pervomajskih-demonstraciyah-po-vsej-ukraine-prinyali-uchastie-pochti-200-tysyach-chelovek";
var s = "https://vimeo.com/64114843";

/*
iframely.getPageData(s, {oembed: false, fullResponse: false}, function(error, data) {
    delete data.html;
    console.log(JSON.stringify(data.oembed, null, 4));

    iframely.getPageData(s, function(error, data) {
        delete data.html;
        console.log(JSON.stringify(data.oembed, null, 4));
    });
});
*/


/*
iframely.getImageMetadata("http://rack.3.mshcdn.com/media/ZgkyMDEzLzA1LzAxLzlkL0FuZGVyc29uVmFsLmM1YTBiLmpwZwpwCXRodW1iCTk1MHg1MzQjCmUJanBn/673862f7/304/Anderson-Valley-composite.jpg", function(error, data) {
    console.log(error);
});
*/

iframely.getImageMetadata("http://my9.imgsmail.ru/r/my/favicon.ico", function(error, data) {
    // error.code == "ENOTFOUND"
    // error == 500
    // error == 404
    //
    console.log(error && error.code);
    console.log(error && error.message.indexOf('no decode delegate'));
    console.log(error);
    console.log(data);
});
