module.exports = {

    re: /^https?:\/\/(?:www\.)?dropbox\.com\/s\/[^?]+\.(png|jpg|jpeg)(\?dl=\d+)?$/i,

    mixins: ['*', 'og-image-rel-image'],

    tests: ["https://www.dropbox.com/s/fwsudc05agl2pwo/Screenshot%202016-08-16%2009.54.37.png?dl=0"]

};