module.exports = {

    getLink: function(url, meta, options, cb) {

        var canonical = (meta.canonical && meta.canonical.href) || meta.canonical || (meta.og && meta.og.url);

        if (canonical instanceof Array) {
            canonical = canonical[0];
        }

        // Redirect to canonical from mobile url.
        if (canonical && url !== canonical 
            && (url.match(/^https?:\/\/(m|mobile)\./i) 
                || url.match(/(\.|\/|\-|_)(?:amp|embed)(?:html)?(\.|\/|\-|_)/i) 
                || url.match(/(\-|\/|\.|!)(?:amp|embed)(?:\.html)?$/i)
                || (!meta.og && !meta.twitter && /(?:embed|amp)/i.test(url)))
            ) {

            // Do not redirect to url from redirects history.
            if (!options.redirectsHistory || options.redirectsHistory.indexOf(canonical) === -1) {

                return cb({
                    redirect: canonical
                });
            }
        }

        cb(null);
    }

    // ex. http://mobile.abc.net.au/news/2014-10-22/government-wants-rooftop-solar-program-to-continue/5833664
    //     http://m.forms2office.com/form/43144244572148
    //     https://www.washingtonpost.com/amphtml/politics/mueller-examining-trumps-draft-letter-firing-fbi-director-comey/2017/09/01/52c6cd8e-8f17-11e7-8df5-c2e5cf46c1e2_story.html
    //     https://www.washingtonpost.com/video/c/embed/145b32ce-d1bd-11e5-90d3-34c2c42653ac
    //     https://e.infogram.com/browser_market_share_totals?src=embed
    //     https://www.sueddeutsche.de/politik/us-grenze-zu-mexiko-trump-will-bis-zu-soldaten-schicken-1.4192873!amp
    //     http://www.spiegel.de/politik/ausland/midterm-wahlen-usa-darum-geht-es-bei-den-zwischenwahlen-a-1234924-amp.html
    //     https://www.t-online.de/nachrichten/deutschland/parteien/id_84705926/tid_amp/kampf-um-merkel-nachfolge-armin-laschet-verzichtet-auf-kandidatur-vorerst.html
    //     http://amp.actionnewsjax.com/news/halloween-candy-possibly-tampered-with-in-clay-county-deputies-say/864286361

};