# Iframely Parsers Changelog

This is the history of the Iframely changes. Updates that are older than one year are not shown.

To stay tuned and up-to-date, watch [Iframely on GitHub](https://github.com/itteco/iframely).

### 2017.06.23, Version 1.1.0

- Node modules dependencies have been upgraded to the recent versions. Please `npm update`
- Added `providerOptions.locale` config option to make parsers requests language-specific version of the sites (test e.g. on facebook.com)
- Domains cleanup

### 2017.04.21, Version 1.0.4

- Added `&omit_css=1` query-string param. Read [details here](https://iframely.com/docs/omit-css) (except for smart iFrame-specific features).
- Twitter and Facebook now return thumbnails for the posts and videos, if any
- Added strawpoll.me (thanks @BenLubar) and Buzzlike (thanks @JnKollo), fixed decoding for Google Docs links (thanks @ajwild)
- Whitelist loading now follows the proxy config if any to work in corporate WANs (thanks @drewlloyd) and also loads the file via SSL by default (thanks @)
- There's now a support for pages of "one-page" and JavaScript apps such as React and Angular (failed to render their templates in ealier versions)
- Other fixes for number of domain parsers

Redis client version was updated (thanks @freelook) - please `npm update` if you use it.


### 2017.02.28, Version 1.0.3

- Gzip fixes for Node 7.2.1 - thanks to @VisualFox
- `autoplay` variants for way more various different providers.
- You can have Facebook width fluid width. Configure as `providerOptions:` `facebook: {width: 'auto'}`
- Customize Giphy: congigure query-string params as `giphy: {get_params: '...'}`
- Added support of whitelisted videos via microforamts in json+ld scripts
- Maintenance of the number of other domain plugins (Vine, G+, Tableau and others)


### 2017.01.12, Version 1.0.2

- Maintenance of the domain plugins
- Better consistency in product prices and article timestamps
- Added custom domains for hosted podcasts: podbean, simplecast and libsyn


### 2016.12.15, Version 1.0.1

- Maintenance of the domain plugins
- Added: iTunes singles, GoPro VR, Lynda.com
- Better coverage for NBC, Sveriges radio, RedBull, Today.com, Pinterest pins and USA Today
- New rel `playerjs` for providers that support [playback events API](https://iframely.com/docs/playerjs) (but without the neeed of iFrame adapters)


### 2016.11.08, Version 1.0.0

- Add ability to specify custom plugins (thanks @iloire and @tbasse!) - change `CUSTOM_PLUGINS` dir in your local settings;
- API responses have better JSON formatting for origin errors (thanks @iloire and @tbasse!);
- Keeping up with various domain changes;
- Better widgets for Apple Music;
- Added piktochart, padlet and KHL.

SemVer is raised not because it's not backwards compatible, but simple because it's time as Iframely has been over 4 years in the making now. Error handling may need a bit of change though if you relied on the text messages.


### 2016.09.27, Version 0.9.9

- Mainly keeping up with domains changes (though a number of them);

### 2016.08.18, Version 0.9.8

Heads up: jwplatform, theplatform, vidyard and cnevids are now covered by generic parsers and appropirate domains will be removed from whitelist. Please update to this version to keep the proper coverage.


- Maintenance of number of domain plugins;
- Added Tableau, Reddit posts, BBC, NPR music section, Samsung VR, Hockey DB


### 2016.07.12, Version 0.9.7

Heads-up: `http-parser-js` module dependency was added for a fix of invalid HTTP headers. Please run `npm install` when deploying this version.

 - Maintenance of number of domain plugins;
 - Fix for CartoDB's new domain name in particular
 - And especially making MLB responsive
 - Also, added BigThink, Art19, Hudl



