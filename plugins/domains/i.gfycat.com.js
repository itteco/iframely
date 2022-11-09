export default {

    re: [
        /https?:\/\/(?:giant|thumbs|zippy)\.gfycat\.com\/([a-zA-Z0-9]+)(?:\-mobile|\-size_restricted)?\.(?:webm|mp4|gif)$/i,
        /https?:\/\/gfycat\.com\/(?:detail|ifr)\/([a-zA-Z0-9]+)$/i        
    ],

    getLink: function(urlMatch, cb) {

        cb ({
            redirect: "https://gfycat.com/" + urlMatch[1]
        });
    },

    tests: [{
        noFeeds: true,
        skipMethods: ["getLink"]
    },
        "https://giant.gfycat.com/ObviousEuphoricHadrosaurus.webm",
        "https://thumbs.gfycat.com/ObviousEuphoricHadrosaurus-mobile.mp4",
        "https://gfycat.com/detail/ImmaculateWastefulCanine",
        "https://zippy.gfycat.com/YellowHelplessDikdik.webm",
        "https://gfycat.com/ifr/EvergreenAbsoluteAracari",
        "https://thumbs.gfycat.com/IdealFluffyBabirusa-size_restricted.gif"
    ]
};