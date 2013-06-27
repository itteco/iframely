module.exports = {

    re: /http:\/\/issuu\.com\/[\w_.-]+\/docs\/([\w_.-]+)/i,

    mixins: [
        "site",
        "canonical",
        "og-title",
        "og-description",

        "favicon",
        "og-image",
        "og-video-responsive"
    ],

    tests: [
        "http://issuu.com/redbulletin.com/docs/the_red_bulletin_stratos_special_us",
        "http://issuu.com/ukrainian_defense_review/docs/udr_02_2013_english",
        "http://issuu.com/folkmag/docs/digital_folk_summer",
        "http://issuu.com/jurnal11/docs/atlas171_jurnalik.ru"
    ]

};