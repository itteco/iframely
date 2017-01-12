# Iframely Parsers Changelog

This is the history of the Iframely changes. Updates that are older than one year are not shown.

To stay tuned and up-to-date, watch [Iframely on GitHub](https://github.com/itteco/iframely).

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

### 2016.06.10, Version 0.9.6

 - Maintenance for many domain plugins: minor fixes and better coverage
 - Added Plot.ly

### 2016.05.11, Version 0.9.5

Heads-up: `request` module dependency was upgraded. Please run `npm update` when deploying this version.

 - Twitter plugin was switched to new oEmbed endpoint according to current docs
 - Medium embeds were disabled as they are broken as of version's date
 - NPR.org plugin supports links to section in addition to direct player links
 - Minor fixes for number of other domain parsers


### 2016.04.13, Version 0.9.4

 - Better responsive embeds for players with fixed bottom padding: Slideshare, NBC news, TODAY.com, NY Times
 - Added support for Deezer, vbox7.com, Libération.fr, hosted CloudApps, Knightlab's juxtapose and timeline.js, NBA, Atlas charts, HuffPost elections pollster
 - Better support for Brightcove's newer HTML5 players
 - Minor fixes for number of other domain parsers


### 2016.02.18, Version 0.9.3

 - Fix errors for Facebook videos where origin pages return sparadic HTTP code 500 ([#106](https://github.com/itteco/iframely/issues/106))
 - Twitter retired 1.1 API for oEmbed from their documentation. oAuth configuration is now optional
 - 500px provides HTML embeds for photos now
 - Fix NHL after their site's re-design
 - Minor fixes for number of other domain parsers


### 2016.01.26, Version 0.9.2

 - Domains clean up & maintenance
 - Added: Reddit comments, Discovery, amCharts, Buzzfeed videos, Fox Sports, NBC Sports, Aljazeera, Naver tvcast, Cinesports, thumbnails for Amazon products
 - Gave better life for `rel=promo`, treat it as attachment media, if you see it



### 2015.12.15, Version 0.9.1

 - Critical fix for Instagram 
 - Facebook plugin now uses new oEmbed endpoints
 - Support for Twitter moments
 - Wider (and responsive) Pinterest pins
 - Added Bleacherreport, Readymag, CBC.ca, Eltiempo, Adobe Stock, Highcharts
 - Minor fixes on some other domain plugins


### 2015.10.19, Version 0.9.0

This version brings significant changes and improvements.

1. Better way to customize individual plugins, for example: 

 - Basic image or video instead of branded embeds for Flickr or Imgur, or Instagram, or Tumblr
 - Different player UI for YouTube and Vimeo
 - "Classic" player for SoundCloud
 - Twitter: center or not, include media or not, show parent message, etc.
 - Facebook: for videos, show entire status rather then just a video
 - Show user message for Instagram embeds
 - Giphy: disable branded GIF player and use plain GIF instead
 - Turn on support of Twitter videos (experimental)

See sample config file for ways to customize. *Heads up:* `twitter.status` in config was renamed to just `twitter`. 


2. Caching improvements

 - We return the cache of source data such as meta and oEmbed or API calls. This way during the updates or whitelist changes Iframely won't create a tsunami of outbound traffic if there is a fresh copy of source in its cache. 
 - Twitter plugin has been completely re-written to properly address API calls caching and also nicely handle of errors 417 (i.e. Twitter's rate-limit reached)

3. Domains 

 - Number of improvements in existing domain plugins. Twitter Videos, better Imgur galleries, etc.
 - New domains: Wikipedia (proper thumbnail and meta), IGN, Dispatch, CBS News, Google Calendars.

4. Update dependencies. 

 - Please run `npm update` as package dependencies have changed. 
 - If you run into `../lib/kerberos.h:5:27: fatal error: gssapi/gssapi.h: No such file or directory`  - see [this comment](https://github.com/itteco/iframely/commit/991406b37da76f0a27501611702cb7a414136a6b)

