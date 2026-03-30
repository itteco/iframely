export default {

    re: /^https?:\/\/issuu\.com\/([\w_.-]+)\/docs\/([\w_.-]+)/i,

    mixins: [ "*" ],

    getLink: function (urlMatch) {

        if (!urlMatch || urlMatch.length < 3) {
            return;
        }

        const embedUrl = `https://e.issuu.com/embed.html?d=${encodeURIComponent(urlMatch[2])}&u=${encodeURIComponent(urlMatch[1])}`;

        let html = `<iframe src="${embedUrl}" style="border:none;width:100%;height:100%;" allowfullscreen allow="fullscreen"></iframe>`;

        html = html.replace(/style=\"[^\"]+\"/i, 'style="top: 0px; left: 0px; width: 100%; height: 100%; position: absolute;"'); 

        var aspect = 4/3;
        html = '<div style="left: 0px; width: 100%; height: 0px; position: relative; padding-bottom: ' +
            Math.round(1000 * 100 / aspect) / 1000
            + '%;">' + html + '</div>';
        
        return {
            html: html,
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.player, CONFIG.R.slideshow, CONFIG.R.inline, CONFIG.R.ssl],
            "aspect-ratio": aspect
        };

    },

    tests: [
        "https://issuu.com/redbulletin.com/docs/the_red_bulletin_stratos_special_us",
        "https://issuu.com/cambridgenews/docs/cambridge_news_march_26_2026",
        "https://issuu.com/_dca/docs/edicio_n_diario_de_centro_ame_rica_02_de_junio_de_20",
        "https://issuu.com/visitfaroeislands/docs/tg25-uk-web_compressed",
        "https://issuu.com/cbmicheals/docs/wwii_hero_franklin_micheals",
        "https://issuu.com/photoedmagazine/docs/photoed-w24_colour_for_issuu_print_replica"
    ]
};