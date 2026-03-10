export default {

    re: [
        /^https?:\/\/(?:www\.)?geometryviewer\.com\/v\/([A-Za-z0-9_-]+\.(stl|obj|gltf|glb|3mf))/i,
        /^https?:\/\/(?:www\.)?geometryviewer\.com\/\?url=https?:\/\/geometryviewer\.com\/uploads\//i
    ],

    mixins: [
        "*"
    ],

    getLink: function(urlMatch) {
        var filename = urlMatch[1];
        var uploadsBase = 'https://geometryviewer.com/uploads/';
        var modelUrl = uploadsBase + filename;

        return {
            href: 'https://geometryviewer.com/embed?url=' + encodeURIComponent(modelUrl),
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.app, CONFIG.R.iframely],
            'aspect-ratio': 1,
            allow: 'xr-spatial-tracking',
            allowfullscreen: true
        };
    },

    tests: [
        {noFeeds: true},
        {skipMethods: ['getData']}
    ]
};
