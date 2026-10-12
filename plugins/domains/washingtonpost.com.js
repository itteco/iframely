export default {

    re: /^https:\/\/www\.washingtonpost\.com\/(?:video|posttv)\/\w+\/(?:\w+\/)?[a-z0-9-]+\/\d+\/\d+\/\d+\/([a-z0-9-]+)_video\.html/i,

    mixins: [
        "*"
    ],

    getLink: function(urlMatch) {

        return {
            href: 'https://www.washingtonpost.com/video/c/embed/' + urlMatch[1],
            accept: CONFIG.T.text_html,
            rel: CONFIG.R.player,
            "aspect-ratio": 16 / 9,
            scrolling: 'no',
            autoplay: "autoplay=1"
        };
    },

    tests: [{
        noFeeds: true
    },
        "https://www.washingtonpost.com/video/world/this-man-is-officially-the-worlds-loudest-person/2026/06/23/95d86920-6b0d-4d57-b391-c455cef59459_video.html",
        "https://www.washingtonpost.com/video/world/a-reporters-journey-into-damascus/2024/12/09/ffa8acf0-4ad4-4f0b-919a-99b83cebf4be_video.html",
        "https://www.washingtonpost.com/video/wellbeing/measles-can-erase-up-to-73-of-your-immune-systems-memory/2026/10/09/42ad4b64-60ae-4b77-87f7-dea639505d4b_video.html",
        "https://www.washingtonpost.com/video/local/weather/destructive-storms-slam-south/2024/04/11/096f78b3-55b1-4002-a6b0-0626b0ddd53d_video.html"
    ]
};