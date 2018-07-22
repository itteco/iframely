// Custom Google Maps

module.exports = {

    re: [
        /^https?:\/\/(?:www\.)?google\.(?:com?\.)?[a-z]+\/maps\/d\/(?:edit|embed|viewer)\?(?:[^&]+&)*(mid)=([a-zA-Z0-9\.\-_]+)/i,
        /^https?:\/\/(?:www\.)?google\.(?:com?\.)?[a-z]+\/maps\/d\/u\/0\/(?:edit|embed|viewer)\?(?:[^&]+&)*(mid)=([a-zA-Z0-9\.\-_]+)/i,
        /^https?:\/\/mapsengine\.google\.(?:com?\.)?[a-z]+\/map\/u\/0\/(?:edit|embed|viewer)\?(?:[^&]+&)*(mid)=([a-zA-Z0-9\.\-_]+)/i,
        /^https?:\/\/mapsengine\.google\.(?:com?\.)?[a-z]+\/map\/u\/0\/viewer\?(?:[^&]+&)*(mid)=([a-zA-Z0-9\.\-_]+)/i,
        /^https?:\/\/mapse\.google\.(?:com?\.)?[a-z]+\/map\/ms\?(?:[^&]+&)*(mid)=([a-zA-Z0-9\.\-_]+)/i,
        /^https?:\/\/(?:www\.)?google\.(?:com?\.)?[a-z]+\/maps\/embed\?(pb)=([^\/\?]+)$/i
    ],

    mixins: [
        "og-image",
        "favicon",
        "canonical",
        "twitter-title"
    ],

    getLink: function(urlMatch) {

        return {
            href: "https://www.google.com/maps/" + (urlMatch[1] === 'pb' ? '' : "d/" )+ "embed?" 
                    + urlMatch[1] + "=" + urlMatch[2] + "&source=iframely", // &for is added to allow direct links to embeds. 
                                                                            // otherwise, won't pass Iframely's validation
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.app, CONFIG.R.ssl, CONFIG.R.html5],
            "aspect-ratio": 640 / 480
        };
    },

    tests: [{
            noFeeds: true
        },
        "https://www.google.com/maps/d/viewer?mid=zkaGBGYwQzao.kWqUdP2InpAI",
        "https://www.google.com/maps/d/edit?mid=zHfMwAb37EWA.kW-Lq0FR1l5c",
        "https://www.google.com/maps/d/viewer?mid=z_qsuFRasJVo.kKU-PVbA1F_0",
        "https://www.google.de/maps/d/embed?mid=zwd3SU4roCAo.kfq8xISQPTjQ"
        //"https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d12096.58902529305!2d-73.9658349!3d40.7147747!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x269399134e767ac4!2sVICE+Media+LLC!5e0!3m2!1sen!2sus!4v14724998038"
    ]
};