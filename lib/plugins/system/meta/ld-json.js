import log from '../../../../logging.js';
import * as utils from '../../../utils.js';

export function ldParser(result, decode, uri) {

    var ld = result["ld-json"];
    delete result["ld-json"];

    if (ld) {
        return utils.parseLDSource(ld, decode, uri);
    }
};

export const notPlugin = true;