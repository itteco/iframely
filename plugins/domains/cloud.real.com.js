module.exports = {

    re: [
        /^https?:\/\/cloud\.real\.com\/(s|share|e)\/([a-zA-Z0-9\-_]+)/i
    ],

    mixins: [
        "twitter-image",
        "favicon",
        "canonical",
        "og-site",
        "twitter-title"
    ],

    getLinks: function(meta, urlMatch) {


        if (! ((meta.og && /video/i.test(meta.og.type)) || urlMatch[1] == 'e')) return;

        var aspect = meta.og && meta.og.image && meta.og.image.height ? meta.og.image.width / meta.og.image.height : 4/3;

        return [{
            href: "https://cloud.real.com/e/" + urlMatch[2] + '?autoplay=false',
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.player, CONFIG.R.ssl, CONFIG.R.html5],
            "aspect-ratio": aspect
        }, {
            href: "https://cloud.real.com/e/" + urlMatch[2] + '?autoplay=true',
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.player, CONFIG.R.ssl, CONFIG.R.html5, CONFIG.R.autoplay],
            "aspect-ratio": aspect
        }]
    },
    
    tests: [
        "https://cloud.real.com/e/K48Bu?autoplay=true",
        "https://cloud.real.com/s/K48Bu"
        // Direct file: "https://cloud.real.com/share/XiyWV7wBN2ZmM6wNmR2HOAzfzf2VAqvuMV8RoPJN4s6cA3RLsFUNU30sBbin14vm5NAl0a7dTLS85KgQaPfYOoTzSJoH3-7t3MYfPpH_eo1qJE8zr_SgIJ-KfZZYUedV#reshare/direct"
    ]
};
