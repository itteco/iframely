# Iframely Changelog

This is the history of the Iframely changes. Updates that are older than one year are not shown.

To stay tuned and up-to-date, watch [Iframely on GitHub](https://github.com/itteco/iframely).

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


### 2015.09.08, Version 0.8.10

 - Domains maintenance

### 2015.07.03, Version 0.8.7

- Cleanup and maintenance of domain plugins
- New domains: Datawrapper, Widgetic
- Option to send params for individual oEmbed providers (`ADD_OEMBED_PARAMS` in sample config)
- General config option to group Iframely JSON's links by rel by default (`GROUP_LINKS`)
- `media=1` optional query string API param that will make Iframely try to return actual media. Ex: Instagram MP4 video instead of status embed
- Direct URLs to office docs are now proxied by Google Docs Viewer



### 2015.06.08, Version 0.8.6

Changes to existing publishers:

- Added Imgur’s new `app` embeds
- Support for direct links to Giphy’s gifs
- All Google parsers: properly handle private content and return status 403 if login is required
- Converted Comedy Central plugin to generic  `sm4` parser for MTV Network
- Domain plugins now allow “*” as a mixin. It activates all other generic parsers. Number of domains have been moved to this approach
- Returns players pinned to Pinterest: YouTube, Vimeo, SoundCloud, TED, DailyMotion


New publishers:

- theta360.com
- npr.org (direct links to popup player)
- CNBC videos
- CNN video gallery (videos in articles still processed through whitelist)
- Returned The Onion videos
- Added Google Spreadsheets (thanks @j0k3r)



### 2015.05.07, Version 0.8.5

- Urgent fix for YouTube as they retired v2 API. 
- Set `config.providerOptions.youtube.api_key` with your Google API key to restore all previous features. See sample local config.
- API key is optional: if not given the parsers will fallback to oEmbed data. 
- It may be the same key you have for new Google Maps, yet copy it in other option.


### 2015.05.06, Version 0.8.3


- New Google Maps plugin to support current URL scheme (Google finally stopped re-directing our user-agent to their classic URLs)
- Google Maps require API key: get it [here](https://developers.google.com/maps/documentation/embed/guide#api_key) and configure as `providerOptions.google.maps_key` - see sample local config
- Support of [Camo Proxy](https://github.com/atmos/camo) for all images (thanks guys from Redbooth). See sample config to activate
- Fixes for Spotify and minor fixes for other domains
- Restored domain plugin for The Guardian


### 2015.04.02, Version 0.8.2

- Fixes for some domain plugins like path.com, visual.ly, prezi, deviantart, storify, roomshare.jp
- Twitter statuses can now have variable width (through `&maxwidth` param) and are aligned to center
- New Facebook Video embeds. Yay!
- New plugins for CartoDB, wasu.cn, ku6.com, datpiff.com, tudou.com, deezer



### 2015.03.04, Version 0.8.0

*Heads up:* 

Starting from this version, the minimal Node.js version required for Iframely is 0.10.22. We had to make a choice to either support latest Node.js or earlier version due to incompatible libraries dependenices. Please, run 'npm update' to update libraries. Unfortunatelly, update likely won't work if your Node is earlier than 0.10.22.


- Instagram status JS embeds with rel `app`
- Tumblr status JS embeds with rel `app` (beware: embeds don't work with SSL)
- International domains for Pinterest
- Google custom maps
- YouTube playlists and timed embeds
- Google+ posts for international usernames. Plus, properly exclude posts in groups
- Medium stories will now have JS embeds too
- Fix issues with caching of JSONP requests
- Number of fixes in various other plugins
