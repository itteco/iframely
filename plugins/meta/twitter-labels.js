export default {

    lowestPriority: true, 

    getMeta: function(twitter) {

        if (twitter["label1"] && twitter["data1"]) {

            var i = 1, j= 1, labels = {};

            while (twitter["label"+i] && twitter["data"+i]) {

                if (twitter["label"+i].match(/^price$/i)) {
                    labels.price = twitter["data"+i];
                } else if (twitter["label"+i].match(/^USD|EUR|GBP|CAD|JPY|AUD$/i)) {
                    labels.price = twitter["data"+i];
                    labels.currency = twitter["label"+i];
                } else if (twitter["label"+i].match(/^currency$/i)) {
                    labels.currency = twitter["data"+i];
                } else if (twitter["label"+i] && twitter["label"+i].indexOf('.') === -1) {
                    labels["label" + j + "-" + twitter["label"+i]] = twitter["data"+i];
                    j++;
                }

                i++;
            }

            return labels;
        }
    }
};