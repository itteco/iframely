export default {

    re: ['twitter.status', 'twitter.timelines'],

    provides: ['twitter_og'],

    getData: function(__allowTwitterOg, meta) {

        return {
            twitter_og: 
                meta.og ? meta.og : {
                    title: meta['html-title'],
                    description: meta.description
                }
        };
    }
};
