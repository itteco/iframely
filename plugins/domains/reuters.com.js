module.exports = {
  
    re: [
        /^https?:\/\/www\.reuters\.com\/video\/\d{4}\/\d{2}\/\d{2}\/[a-zA-Z0-9\-]+\?videoId=(\d+)/i
    ],

    mixins: ["*"],

    getLink: function (urlMatch) {

        return {
            href: "https://www.reuters.com/assets/iframe/yovideo?videoId=" + urlMatch[1],
            rel: [CONFIG.R.player, CONFIG.R.html5],
            accept: CONFIG.T.text_html,
            'aspect-ratio': 512 / 288
        }
    },

    tests: [
        "http://www.reuters.com/video/2017/10/18/four-legged-robodog-leaps-into-action?videoId=372769822&videoChannel=118065&channelName=Moments+of+Innovation"
    ]
};