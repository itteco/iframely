import * as utils from '../../../utils.js';
import * as URL from 'url';

export default {

    prepareLink: function(url, options, link) {

        if (link.rel.indexOf(CONFIG.R.map) > -1 
            && (!link.options || !link.options.layout && !link.options.aspect)
            && link.media 
            && link.media['aspect-ratio'] /* && !== 0, invertable */ ) {

            link.options = link.options || {};

            const original_aspect = link.media['aspect-ratio'];
            const original_layout =  original_aspect > 1 
                                        ? 'landscape' : 
                                            (original_aspect < 1 
                                                ? 'portrait' : 'square');

            const layout = options.getRequestOptions(
                utils.getProviderName(url) + ".layout",
                original_layout
            );

            link.options.layout = {
                label: 'Map orientation',
                value: layout,
                values: {
                    'landscape': 'Landscape',
                    'portrait': 'Portrait',
                    'square': 'Square'
                }
            };

            if (layout != original_layout) {
                if (layout === 'square') {
                    link.media['aspect-ratio'] = 1;
                } else {
                    link.media['aspect-ratio'] = 1 / original_aspect;
                }
            }
        }
    }
};