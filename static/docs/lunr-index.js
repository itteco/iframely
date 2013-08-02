
var index = lunr(function () {
    this.field('body');
    this.ref('url');
});

var documentTitles = {};



documentTitles["/r3/docs/readme.html#iframely-embeds-gateway"] = "Iframely Embeds Gateway";
index.add({
    url: "/r3/docs/readme.html#iframely-embeds-gateway",
    title: "Iframely Embeds Gateway",
    body: "# Iframely Embeds Gateway  [http://iframely.com](http://iframely.com)  [![Build Status](https://travis-ci.org/itteco/iframely.png?branch=master)](https://travis-ci.org/itteco/iframely)  Iframely is self-hosted embeds gateway, giving you single endpoint to get rich embeds data of any URL.   Iframely is Node.JS app (and/or package), but you can access it from other environments via API. Main endpoint (see [example](http://iframely.com/iframely?uri=http%3A%2F%2Fvimeo.com%2F67452063)):      /iframely?uri={url encoded http link to a web page}   Iframely provides out-of-the-box:   - Generic parsers of [Open Graph](http://ogp.me/), [Twitter Cards](https://dev.twitter.com/docs/cards), [oEmbed v1](http://oembed.com/) and Readability articles  - Caching for performance optimizations (Memached, Redis or in-memory engines)  - API for unified/merged meta, thumbnails (incl sizes), video, players, articles  - Plugins arсhitecture to extend the logic or to implement custom domain parsers  - More than 100 parsers for specific domains, like YouTube, Vimeo, Soundcloud, Instagram, etc.   (c) 2013 Itteco Software Corp. Licensed under MIT.  _Itteco also is developing additional services for developers and publishers, which will help us finance the maintenance of this open-source project. Please, [submit your email here](http://iframely.com) to get notified and support our effort._   "
});

documentTitles["/r3/docs/readme.html#getting-started"] = "Getting Started";
index.add({
    url: "/r3/docs/readme.html#getting-started",
    title: "Getting Started",
    body: "## Getting Started  "
});

documentTitles["/r3/docs/readme.html#do-not-forget"] = "Do not forget :)";
index.add({
    url: "/r3/docs/readme.html#do-not-forget",
    title: "Do not forget :)",
    body: "### Do not forget :)  - To give Iframely a star on GitHub - To [follow Iframely on Twitter](https://twitter.com/iframely) or watch this repo to get updates   "
});

documentTitles["/r3/docs/readme.html#community-endpoint"] = "Community Endpoint";
index.add({
    url: "/r3/docs/readme.html#community-endpoint",
    title: "Community Endpoint",
    body: "### Community Endpoint  __Please note__: You may use skip installation and use community endpoint to rapidly develop against it:      http://iframely.com/iframely?uri=  This endpoint is provided courtesy of Itteco and has the latest version of iframely deployed. It is subject to restarts and rate-limits and thus is not suitable for production use.   Please deploy iframely on your own hardware before going live.   "
});

documentTitles["/r3/docs/readme.html#quick-api-response-intro"] = "Quick API Response Intro";
index.add({
    url: "/r3/docs/readme.html#quick-api-response-intro",
    title: "Quick API Response Intro",
    body: "### Quick API Response Intro  In response to `/iframely?uri=` requests, Iframely will return JSON with the embed links and unified meta semantics.   Response structure is close resemblance of the following analogue of `&lt;head&gt;` part of the URL's page:      &lt;head&gt;         &lt;meta name=\&quot;...\&quot; value=\&quot;...\&quot;/&gt;         &lt;link rel=\&quot;iframely player\&quot; href=\&quot;...\&quot; type=\&quot;text/html\&quot; media=\&quot;aspect-ratio: 1.778\&quot; title=\&quot;...\&quot;&gt;     &lt;/head&gt;  JSON response will look like:      {       \&quot;meta\&quot;: {                                         -- Unified meta object, see description in next section.         \&quot;title\&quot;: \&quot;BLACK&amp;BLUE\&quot;,                          -- Page title attribte.         ...       },       \&quot;links\&quot;: [                                        -- Array of links which can be rendered.         {           \&quot;href\&quot;: \&quot;//player.vimeo.com/video/67452063\&quot;,  -- URI of link. If both http and https are available, starts with `//`           \&quot;type\&quot;: \&quot;text/html\&quot;,                          -- MIME type of link content.           \&quot;rel\&quot;: [                                      -- Array of link semantic types.             \&quot;player\&quot;,                                   -- `player` - is widget playing some media.             \&quot;iframely\&quot;                                  -- `iframely` - indicates custom code of Iframely:                                                             in this example, we added responsive `aspect-ratio` and `//`            ],           \&quot;title\&quot;: \&quot;BLACK&amp;BLUE\&quot;,                        -- Usual html link title attribute, equals meta.title.           \&quot;media\&quot;: {                                    -- \&quot;media query\&quot; semantics to provide widget media properties.             \&quot;aspect-ratio\&quot;: 1.778                       -- This means widget is responsive and proportionally resizable.           }         },         ...       ]     }   You can use `iframely.js` jQuery script to communicate with Iframely endpoint and render the embeds.  See `docs` folder for more details on API and `iframely.js`   "
});

documentTitles["/r3/docs/readme.html#visual-debug-tool"] = "Visual Debug Tool";
index.add({
    url: "/r3/docs/readme.html#visual-debug-tool",
    title: "Visual Debug Tool",
    body: "### Visual Debug Tool  The visusal debug tool is at [http://iframely.com/debug](http://iframely.com/debug).  Once you deploy Iframely to your own servers, you will have your own copy of technical debug tool at `/debug` address.  You can also get a debugger as [Google Chrome extension here](https://chrome.google.com/webstore/detail/iframely-semantic-url-deb/lhemgegopokbfknihjcefbaamgoojfjf).   "
});

documentTitles["/r3/docs/readme.html#install-other-docs"] = "Install &amp; Other Docs";
index.add({
    url: "/r3/docs/readme.html#install-other-docs",
    title: "Install &amp; Other Docs",
    body: "### Install &amp; Other Docs  To get a copy of Iframely, you have three options:  * [Download the latest release](https://github.com/itteco/iframely/zipball/master). * Install via NPM: `npm install iframely`. * Clone the repo: `git clone git://github.com/itteco/iframely.git`.  Please, see the `docs` folder for more detailed install and configuration instructions as well as API description.   "
});

documentTitles["/r3/docs/readme.html#sample-apps-demos"] = "Sample Apps &amp; Demos";
index.add({
    url: "/r3/docs/readme.html#sample-apps-demos",
    title: "Sample Apps &amp; Demos",
    body: "### Sample Apps &amp; Demos  Itteco has developed the following services based on Iframely technology: * [Nowork FM](http://nowork.fm) - simple intranet for co-working gangs * [Iframe.ly](http://iframe.ly) - the web shortener  If you'd like your app to be included into the list - please, fork repository and add it to README.md, then submit pull-request.   "
});

documentTitles["/r3/docs/readme.html#contributing"] = "Contributing";
index.add({
    url: "/r3/docs/readme.html#contributing",
    title: "Contributing",
    body: "## Contributing  Please, feel free to [reach us on Twitter](http://twitter.com/iframely) or to [submit an issue](https://github.com/itteco/iframely/issues).  Fork and do a pull-request, if you'de like to add more plugins and/or contribute fixes or improvements. By doing so, you make your work available under the same MIT license.  If you are a publisher and would like to make your embeds available as oEmbed/2 (and thus distributed through iframely) - please, do get in touch or [cast your email here](http://iframely.com).   "
});

documentTitles["/r3/docs/readme.html#authors"] = "Authors";
index.add({
    url: "/r3/docs/readme.html#authors",
    title: "Authors",
    body: "## Authors  The authors and maintainers of the package are these guys from [Itteco](http://itteco.com):  - [Nazar Leush](https://github.com/nleush) - _the_ author  - [Ivan Paramonau](https://twitter.com/iparamonau) - coffee, donuts &amp; inspiration  Please, check the [contributors list](https://github.com/itteco/iframely/graphs/contributors) to get to know awesome folks that also helped a lot.   "
});



documentTitles["/r3/docs/oembed-2-draft.html#oembed2-quick-draft"] = "oEmbed/2 quick draft";
index.add({
    url: "/r3/docs/oembed-2-draft.html#oembed2-quick-draft",
    title: "oEmbed/2 quick draft",
    body: "## oEmbed/2 quick draft [oembed2]: #oembed2-quick-draft \&quot;oEmbed/2 draft\&quot;  Iframely is based on [oEmbed/2][oembed2]:   - Name it \&quot;oEmbed two\&quot; or \&quot;half oEmbed\&quot;, because -   - It removes the semantics part of [oEmbed](http://oembed.com) out of the scope of the spec (as there is plenty of `meta` available already on the page)  - Keeps the discovery part through `&lt;link&gt;` tag in the `&lt;head&gt;` of the page  - And specifies technological approaches and use case for embeds to improve end user's experience in modern realities (HTML5, CSS3, HTTP1.1)   [oEmbed spec](http://oembed.com) was remarkable and ingenious in 2008. It was unlocking numerous opportunities for developers and businesses alike.  All of a sudden, as a publisher you could get enormous distribution of your content into all the apps (and their user base) that consume it per spec.  For app developers it meant they could provide significantly more engaging user experience and higher value to better retain their customers. However, due to inconsistencies in implementations, security considerations and lack of progress on semantics part, the progress towards a movable web stumbled.  oEmbed/2 eliminates the semantic part of [oEmbed](http://oembed.com) as other semantic protocols such as [Open Graph]((http://ogp.me/)) and RDFa in general have clearly gone mainstream. Besides, there is plenty of other `&lt;meta&gt;` data, available for a web page.   Thus, oEmbed/2 is primarily for discovery of what publisher has got to offer and agreeing on the use cases.  **Discovery is expected to happen when publisher puts `&lt;link&gt;` tag in the head of their webpage:**       &lt;link rel=\&quot;player twitter\&quot;            // intended use case     type=\&quot;text/html\&quot;                      // embed as iframe     href=\&quot;//iframe.ly/234rds\&quot;             // with this src     media=\&quot;min-width: 100\&quot;                // when these sizes are ok     title=\&quot;Thanks for all the fish!\&quot; &gt;       - The use cases shall be listed in `rel` attributed, separated by a space. The dictionary of use cases is not fixed, and it is up to publisher and provider to choose what to publish or consume.  Iframely endpoint can currently output the following `rel` functional use cases: `favicon`, `thumnail`, `image`, `player`, `reader`, `logo`. In addition, we supplement with `rel` indicating origin, such as `twitter` for example.  - `type` attribute of a link specified the MIME type of the link, and so dicttes the way the embed resources shall be embedded. Iframely supports embeds as iframe, image and javascript.  - `href` attributes is preferrably via https protocol to ensure maximum distribution for publishers' content, as consumers may opt not to consider http-only embeds.  - `media` is for media queries, indicating the sizes of the containers where embed content would fit.    As a \&quot;good citizen\&quot; policy and business etiquette, it is worth to remind that both consumer and publisher work together towards a common goal of providing the best user experience possible for their shared audience, and not against each other in order to solicit a customer. Never should it be acceptable to undermine user experience in lieu of providing value.  This is a draft idea. More specific description will be published once we gather sufficient feedback from the community."
});



documentTitles["/r3/docs/setup.html#server-setup"] = "Server setup";
index.add({
    url: "/r3/docs/setup.html#server-setup",
    title: "Server setup",
    body: "## Server setup  - [Security considerations](#security-considerations) - [Installation](#installation) - [Config](#config) - [Run server](#run-server) - [List of server urls](#list-of-server-urls) - [Server debug tool](#server-debug-tool) - [Update iframely](#update-iframely)  "
});

documentTitles["/r3/docs/setup.html#security-considerations"] = "Security considerations";
index.add({
    url: "/r3/docs/setup.html#security-considerations",
    title: "Security considerations",
    body: "### Security considerations  It is highly recommended that you install the server on a separate domain. There are few cases, when rendering of embed content is required by the server, for example the articles. Even though iframely tries to eliminate any insecure code of 3rd parties, for cross-domain security of your application, it will be wiser to keep render endpoints under different domain and allow your main domain in CORS settings (see [config options](#config)).  "
});

documentTitles["/r3/docs/setup.html#installation"] = "Installation";
index.add({
    url: "/r3/docs/setup.html#installation",
    title: "Installation",
    body: "### Installation  Node.js versions 0.8-0.10 required. Install if from [pre-built installer](http://nodejs.org/download/) for your platform or from [package managers](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager).      cd &lt;your servers dir&gt;     git clone https://github.com/itteco/iframely.git     cd iframely     npm install  It will also install all the package dependencies.  If you're using Mac OS, you might need to install ImageMagic CLI tools to make image size detection work.   "
});

documentTitles["/r3/docs/setup.html#config"] = "Config";
index.add({
    url: "/r3/docs/setup.html#config",
    title: "Config",
    body: "### Config  Please, create your local config file to adjust settings. This local config file will be ignored when you update versions from Git later on.      cp config.local.js.SAMPLE config.local.js     vi config.local.js  Edit the sample config file as you need. You may also override any values from main config.js in your local config. There are some provider-specific values you might want to configure (e.g. wheather to include media in Twitter status embeds). You can also fine-tune API response time by disabling image size detection or readability parsing.   For enhanced security, it is important that you properly configure `allowedOrigins` parameter for CORS.  __Important__: At the very least, you need to enter your own application keys and secret tokens where applicable.    "
});

documentTitles["/r3/docs/setup.html#run-server"] = "Run server";
index.add({
    url: "/r3/docs/setup.html#run-server",
    title: "Run server",
    body: "### Run server  Starting server is simple. From iframely home directory:      node server  We highly recommend [forever](https://github.com/nodejitsu/forever) though as it makes stopping and restarting of the servers so much easier:      npm install -g forever     forever start -l iframely.log server.js   "
});

documentTitles["/r3/docs/setup.html#list-of-server-urls"] = "List of server urls";
index.add({
    url: "/r3/docs/setup.html#list-of-server-urls",
    title: "List of server urls",
    body: "### List of server urls  You may need to configure these in your reverse proxy settings, depending on your setup:      /r/.+               -- static files (including iframely.js client library).     /iframely           -- main API endpoint with get params - returns oEmbed/2 as JSON.     /debug              -- debugger UI with get params.     /reader.js          -- API endpoint with get params - proxies script to render article.     /render             -- API endpoint with get params - prexies custom widgets if required.     /meta-mappings      -- API endpoint with available unified meta.  "
});

documentTitles["/r3/docs/setup.html#server-debug-tool"] = "Server debug tool";
index.add({
    url: "/r3/docs/setup.html#server-debug-tool",
    title: "Server debug tool",
    body: "### Server debug tool  You can visualize server API with debug tool at:   - [http://localhost:8061/debug](http://localhost:8061/debug), try [example](http://localhost:8061/debug?uri=http%3A%2F%2Fvimeo.com%2F67487897)  If your local configuration turns debug mode on, the debug tool will also show the debug information for the plugins used (useful when developing plugins - see Wiki for how to write plugins)  "
});

documentTitles["/r3/docs/setup.html#update-iframely"] = "Update iframely";
index.add({
    url: "/r3/docs/setup.html#update-iframely",
    title: "Update iframely",
    body: "### Update iframely  As we keep adding features, you may want to update your server. The domain providers due to dependencies to 3rd parties do break from time to time, and we'll release hot fixes in this case. Please, follow [Iframely on Twitter](http://twitter.com/iframely) to get timely heads up when hot fixes are required.  To update a package to it's latest version run in iframely home directory:      git pull      and restart your server. If you use forever, run:      forever restartall"
});



documentTitles["/r3/docs/api.html#api-reference"] = "API Reference";
index.add({
    url: "/r3/docs/api.html#api-reference",
    title: "API Reference",
    body: "## API Reference  - [/iframely: _the_ API endpoint][iframely]     - [meta](#meta)     - [links](#links)         - [MIME types](#mime-types)         - [rel](#rel)         - [media](#media) - [iframely.js: JavaScript client lib][iframely-js]     - [Add to your page](#add-to-your-page)     - [Fetch oEmbed/2](#fetch-oembed2)     - [Render links](#render-links) - TODO: [Using Iframely as npm package](#using-iframely-as-npm-package)  "
});

documentTitles["/r3/docs/api.html#iframely-api-endpoint"] = "/iframely API endpoint";
index.add({
    url: "/r3/docs/api.html#iframely-api-endpoint",
    title: "/iframely API endpoint",
    body: "### /iframely API endpoint [iframely]: #iframely-api-endpoint  This is the actual oEmbed/2 gateway endpoint and the core of Iframely.  **Method:** GET  **Params:**  - `uri` - (required) URI of the page to be processed.  - `refresh` - (optional) You can request the cache data to be ingored by sending `true`. Will unconditionally re-fetch the original source page.  **Returns:** JSON, see [example](http://iframely.com/iframely?uri=http%3A%2F%2Fvimeo.com%2F67452063).  Description of result:      {       \&quot;meta\&quot;: {                                         -- Unified meta object, see description in next section.         \&quot;title\&quot;: \&quot;BLACK&amp;BLUE\&quot;,                          -- Page title attribte.         ...       },       \&quot;links\&quot;: [                                        -- Array of links which can be rendered.         {           \&quot;href\&quot;: \&quot;//player.vimeo.com/video/67452063\&quot;,  -- URI of link. If both http and https are available, starts with `//`           \&quot;type\&quot;: \&quot;text/html\&quot;,                          -- MIME type of link content.           \&quot;rel\&quot;: [                                      -- Array of link semantic types.             \&quot;player\&quot;,                                   -- `player` - is widget playing some media.             \&quot;iframely\&quot;                                  -- `iframely` - indicates custom code of Iframely:                                                             in this example, we added responsive `aspect-ratio` and `//`            ],           \&quot;title\&quot;: \&quot;BLACK&amp;BLUE\&quot;,                        -- Usual html link title attribute, equals meta.title.           \&quot;media\&quot;: {                                    -- \&quot;media query\&quot; semantics to provide widget media properties.             \&quot;aspect-ratio\&quot;: 1.778                       -- This means widget is responsive and proportionally resizable.           }         },         ...       ]     }  Idea of unified 'meta' and 'links' item specific attributes are described in following sections.  ---------------------------------------  "
});

documentTitles["/r3/docs/api.html#meta"] = "meta";
index.add({
    url: "/r3/docs/api.html#meta",
    title: "meta",
    body: "#### meta  Most web pages have organic `&lt;meta&gt;` data using different semantics: twitter, og, meta, dublin core, parsely, sailthru, etc.  Iframely merges different semantics into fields with unified consistent naming, so you can reliably use them (if they are present, of course).  Iframely `meta` object may contain the following keys at the moment:  General meta:   - `title`  - `description`  - `date` (the publication date)  - `canonical` - canonical URL of the resource   - `shortlink` - URL shortened through publisher  - `category`  - `keywords`  Attribution:   - `author`  - `author_url`   - `copyright`  - `license`  - `license_url`  - `site`   Stats info:   - `views` - number of views on the original host  - `likes`  - `comments`  - `duration` (in seconds, duration of video or audio content)   Geo (as per Open Graph spec):   - `country-name`  - `postal-code`   - `street-address`  - `region`  - `locality`  - `latitude`  - `longitude`  All current attributes are listed in `/meta-mappings` endpoint.  ---------------------------------------  "
});

documentTitles["/r3/docs/api.html#links"] = "links";
index.add({
    url: "/r3/docs/api.html#links",
    title: "links",
    body: "#### links  Following sections will describe available link attributes values.  "
});

documentTitles["/r3/docs/api.html#mime-types"] = "MIME types";
index.add({
    url: "/r3/docs/api.html#mime-types",
    title: "MIME types",
    body: "##### MIME types  Generally MIME type defines method to render link as widget.  MIME type is an expected http response \&quot;content-type\&quot; of data behind '\&quot;href\&quot;'. Type of content defines rendering method.  There are following types for now:   - `\&quot;text/html\&quot;` - this could be rendered as `&lt;iframe&gt;`.  - `\&quot;application/javascript\&quot;` - JavaScript widget with dynamic page embedding with `&lt;script&gt;` tag.  - `\&quot;text/x-safe-html\&quot;` - this is an internal type for plugins. It will be converted to `\&quot;application/javascript\&quot;` delivered through iframely's `/render.js` endpoint.  - `\&quot;application/x-shockwave-flash\&quot;` - flash widget, will be rendered with `&lt;iframe&gt;`.  - `\&quot;video/mp4\&quot;` - html5 video. Will be rendered with `&lt;iframe&gt;`. TODO: render with `&lt;video&gt;` tag.  - `\&quot;image\&quot;` - this is image which will be rendered with `&lt;img&gt;` tag. Below are the specific image types. If format is not specified engine will try to detect it by fetching image head.   - `\&quot;image/jpeg\&quot;`   - `\&quot;image/icon\&quot;`   - `\&quot;image/png\&quot;`   - `\&quot;image/svg\&quot;`  ---------------------------------------  "
});

documentTitles["/r3/docs/api.html#rel"] = "`rel`";
index.add({
    url: "/r3/docs/api.html#rel",
    title: "`rel`",
    body: "##### `rel`  `Rel` is for intended use case of the link.  Usually it should be used to find better link for rendering in specific cases.   - `player` - wiget which plays video or music or slideshow. E.g. it could be `\&quot;text/html\&quot;` page with embedded media.  - `thumbnail` - small image.  - `image` - large (not small) image.  - `reader` - reading widget (article or some info).  - `file` - downloadable file.  - `icon` - link with favicon.  - `logo` - link with site's logo. Is returned mostly for pages with the news article (custom ones) for better attribution  Iframely uses supplementary `rels` as the way of attributing to the origin of the data:   - `iframely` - link or attributes are customly altered by iframely through one of the domain plugin. Consider it a whitelist.  - `readability` or `instapaper` - article extracted using instapaper classes.  - `og` - link extracted from opengraph semantics. Beware, `players` rendered through `og` have higher chance of being unreliable.   - `twitter` - link extracted from twitter semantics.  - `oembed` - link extracted from oembed/1 semantics.  You would need to make a decision wheather you want to trust specific origins or not.  ---------------------------------------  "
});

documentTitles["/r3/docs/api.html#media"] = "`media`";
index.add({
    url: "/r3/docs/api.html#media",
    title: "`media`",
    body: "##### `media`  Media section is for media query. Iframely generates attributes as well as puts it into usable JSON.  Plugins use the following media query attributes at the moment:   - `width`  - `min-width`  - `max-width`  - `height`  - `min-height`  - `max-height`  - `aspect-ratio` - available only if **width** and **height** not present  - `orientation`   "
});

documentTitles["/r3/docs/api.html#iframelyjs-javascript-client-lib"] = "iframely.js: JavaScript client lib";
index.add({
    url: "/r3/docs/api.html#iframelyjs-javascript-client-lib",
    title: "iframely.js: JavaScript client lib",
    body: "### iframely.js: JavaScript client lib [iframely-js]: #iframely-js-javascript-client-lib  Iframely package includes the client wrapper over the API, so you don't need to spend time on it yourself.  You may access it in `/static/js/iframely.js` folder. It provides calls to fetch data from `/iframely` API endpoint and render links.  "
});

documentTitles["/r3/docs/api.html#add-to-your-page"] = "Add to your page";
index.add({
    url: "/r3/docs/api.html#add-to-your-page",
    title: "Add to your page",
    body: "#### Add to your page  Insert similar lines in your page head (iframely.js requires jQuery and Underscore):      &lt;script type=\&quot;text/javascript\&quot; src=\&quot;//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js\&quot;&gt;&lt;/script&gt;     &lt;script type=\&quot;text/javascript\&quot; src=\&quot;//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.4/underscore-min.js\&quot;&gt;&lt;/script&gt;     &lt;script type=\&quot;text/javascript\&quot; src=\&quot;http://your.domain/r3/js/iframely.js\&quot;&gt;&lt;/script&gt;  Replace `your.domain` with your actual domain name. You may also copy `iframely.js` script file to your apps main domain and accordingly.  "
});

documentTitles["/r3/docs/api.html#fetch-oembed2"] = "Fetch oEmbed/2";
index.add({
    url: "/r3/docs/api.html#fetch-oembed2",
    title: "Fetch oEmbed/2",
    body: "#### Fetch oEmbed/2      // Setup endpoint path.     $.iframely.defaults.endpoint = 'http://your.iframely.server.domain/iframely';      // Start data fetching. Specify page uri and result callback.     $.iframely.getPageData(\&quot;http://vimeo.com/67452063\&quot;, function(error, data) {         console.log(data);     });  This code will create following [log](http://iframely.com/iframely?uri=http%3A%2F%2Fvimeo.com%2F67452063):      {       \&quot;meta\&quot;: {         \&quot;canonical\&quot;: \&quot;http://vimeo.com/67452063\&quot;,         \&quot;title\&quot;: \&quot;BLACK&amp;BLUE\&quot;,         \&quot;author\&quot;: \&quot;ruud bakker\&quot;,         \&quot;author_url\&quot;: \&quot;http://vimeo.com/ruudbakker\&quot;,         \&quot;duration\&quot;: 262,         \&quot;site\&quot;: \&quot;Vimeo\&quot;,         \&quot;description\&quot;: \&quot;Is it bad luck?\nIs it fate?\nOr just stupid?\n\nBLACK&amp;BLUE is my graduation film from AKV st. Joost, Breda, The Netherlands.\n\nWritten, animated and directed by Ruud Bakker\nMusic and sounddesign by Bram Meindersma, Audiobrand\n\nScreenings\n\nPictoplasma Berlin, Germany 2013\nKlik! Amsterdam, The Netherlands 2012\nMultivision, st Petersburg, Russia 2012\nCut-Out Fest, Querétaro, Mexico 2012\nFête de l'anim, Lille, France 2012\nPlaygrounds Festival, Tilburg, The Netherlands, 2012\n\nwww.thisisbeker.com\&quot;       },       \&quot;links\&quot;: [         {           \&quot;href\&quot;: \&quot;//player.vimeo.com/video/67452063\&quot;,           \&quot;type\&quot;: \&quot;text/html\&quot;,           \&quot;rel\&quot;: [             \&quot;player\&quot;,             \&quot;iframely\&quot;           ],           \&quot;title\&quot;: \&quot;BLACK&amp;BLUE\&quot;,           \&quot;media\&quot;: {             \&quot;aspect-ratio\&quot;: 1.778           }         },         {           \&quot;href\&quot;: \&quot;http://a.vimeocdn.com/images_v6/apple-touch-icon-72.png\&quot;,           \&quot;type\&quot;: \&quot;image\&quot;,           \&quot;rel\&quot;: [             \&quot;icon\&quot;,             \&quot;iframely\&quot;           ],           \&quot;title\&quot;: \&quot;BLACK&amp;BLUE\&quot;,           \&quot;media\&quot;: {             \&quot;width\&quot;: 72,             \&quot;height\&quot;: 72           }         },         {           \&quot;href\&quot;: \&quot;http://b.vimeocdn.com/ts/439/417/439417999_1280.jpg\&quot;,           \&quot;type\&quot;: \&quot;image\&quot;,           \&quot;rel\&quot;: [             \&quot;thumbnail\&quot;,             \&quot;oembed\&quot;           ],           \&quot;title\&quot;: \&quot;BLACK&amp;BLUE\&quot;,           \&quot;media\&quot;: {             \&quot;width\&quot;: 1280,             \&quot;height\&quot;: 720           }         }       ]     }  This is parsed JSON object. You can use `data.meta` to get page meta attributes or `data.links` to render some objects from the page.  "
});

documentTitles["/r3/docs/api.html#render-links"] = "Render links";
index.add({
    url: "/r3/docs/api.html#render-links",
    title: "Render links",
    body: "#### Render links  Each link in result from previous example can be rendered:      // Iterate through all links.     data.links.forEach(function(link) {          // Call generator to create html element for link.         var $el = $.iframely.generateLinkElement(link, data);          // Add element to body.         $('body').append($el);     });   If you'd like to make `reader` iframes to be without horizontal scrolling call after rendering widgets:      $.iframely.registerIframesIn($('body'));  You can call it once after all or after each rendering operation.  This is useful with [github.gist](http://iframely.com/debug?uri=https%3A%2F%2Fgist.github.com%2Fkswlee%2F3054754) or [storify](http://iframely.com/debug?uri=http%3A%2F%2Fstorify.com%2FCNN%2F10-epic-fast-food-fails) pages, where js widget is inserted in iframe and we don't know exact size before it launched. After widget is rendered, custom script in that iframe sends message to parent about new window size. So iframely.js will resize that iframe to fit content without horizontal scrolling.    "
});

documentTitles["/r3/docs/api.html#using-iframely-as-npm-package"] = "Using Iframely as npm package";
index.add({
    url: "/r3/docs/api.html#using-iframely-as-npm-package",
    title: "Using Iframely as npm package",
    body: "### Using Iframely as npm package  Install:      npm install iframely  Usage:      var iframely = require(\&quot;iframely\&quot;);  `TODO: doc on iframely.getRawLinks`  `TODO: publish method + doc on iframely.getPageData` (+shortcuts to fetch only oembed or else)  `TODO: publish method + doc on iframely.getImageMetadata`"
});



documentTitles["/r3/docs/write-a-plugin.html#write-a-plugin"] = "Write a Plugin";
index.add({
    url: "/r3/docs/write-a-plugin.html#write-a-plugin",
    title: "Write a Plugin",
    body: "## Write a Plugin   - TODO [Plugin structure](#plugin-structure)     - TODO [plugin.getLink(s)](#plugingetlinks)     - [plugin.getMeta](#plugingetmeta)         - [plugin.getMeta priorities](#plugingetmeta-priorities)     - TODO [plugin.getData](#plugingetdata)     - TODO [plugin.mixins](#pluginmixins)     - TODO [plugin.tests](#plugintests)  - TODO [Type of plugins](#type-of-plugins)     - TODO [Generic plugins](#generic-plugins)         - TODO [Meta plugins](#meta-plugins)     - TODO [Domain plugins](#domain-plugins)     - TODO [Custom plugins](#custom-plugins)     - TODO [Template plugins](#template-plugins)  - TODO [Custom links cases](#custom-links-cases)     - TODO [x-safe-html](#x-safe-html)     - TODO [Rendering templates](#rendering-templates)     - TODO [Resize embedded iframe from inside iframe](#resize-embedded-iframe-from-inside-iframe)  **Terms**   - **plugin** - node.js module.  - **plugin method** - function in that plugin.  - **plugin method requirements** - named params of that function.  - **URI** - page URI on wich iframely search links and meta.  Plugins are node.js modules with attributes and functions defined by iframely engine:   - **mixins** - list of plugins' to use with domain plugin. Plugins identified by its file name without extension and path.  - **re** - list or single RegExp for testing page URI.  - **getLink** - method to generate link.  - **getLinks** - method to generate links array.  - **getMeta** - method to create page unified meta.  - **getData** - this method generates data, which can be used by other plugins and methods (getMeta, getLink(s) and getData).  - **tests** - array of test urls to test plugin work. This is not used yet.  - **lowestPriority** - marks plugin's getMeta method with low priority.  - **highestPriority** - marks plugin's getMeta method with highest priority.  `TODO: add links to sections`  Main work is done by plugins' methods getMeta, getLink(s) and getData. These methods work similar but returns different kind of objects (hashes). Each method has a number of params, called **requirements**. For example:      getLink: function(meta, oembed) {         return {             title: oembed.title,             description: meta.description         };     }  `getLink` uses **meta** and **oembed** params, so they are method's **requirements**.  Iframely engine know that by parsing module code and provides that parameters when method is called. If some requirements are not available, method will not be called. This means all defined method params ara mandatory requirements. Here is the list of all available default requirements:   - **urlMatch** - variable got after matching page URI against **re** RegExpes attribute of plugin. This is available only if domain plugin which has **re** attribute is used.  - **url** - page URI itself.  - **request** - known [request module](https://github.com/mikeal/request), wrapped with caching (caching not implemented yet). This is useful to call some external APIs' methods.  - **meta** - parsed paged meta head. You can see how page meta is parsed in [debugger, \&quot;Plugins context\&quot; section](http://dev.iframe.ly/debug?uri=http%3A%2F%2Fvimeo.com%2F67452063).  - **oembed** - parsed oembed 1.0 (if available for page).  - **html** - entire page response decoded to UTF-8.  - **$selector** - jquery wrapper of page. Useful for fast accessing some page data by element class, e.g. `$selector('.item').text()`.  - **cb** - this is result callback. If method requires **cb** - it means method is asynchronous. Engine will wait calling of **cb**. Without **cb** - method must return object synchronously.  Plugin can provide custom requirements using **getData** method. See [plugin.getData](#plugingetdata) for details.  Here is engine algorithm to work with plugins:   1. Extract URI domain (e.g. `example.com`).  2. Find suitable domain plugins for that URI.     1. If domain plugins found:         1. Check if domain plugins has **re** attribute.             1. If true:                 1. Match all RegExp'es against URI and create urlMatch variable.                 2. Use only plugins with matched **re**s.                 3. If no matched plugins found - use domain plugins without **re**.                 4. If all plugins has **re** and no matches found - use all generic plugins.             2. If false:                 1. Use all domain plugins.     2. If suitable domain plugins **not** found:         1. Use all generic plugins.  3. Find methods of selected plugins to call:     1. Iterate all used plugins:         1. Itarate all plugin methods:             1. If method has only default requirements (see list below) - use it.             2. If method has custom requirements (provided by some getData method) - skip it.  4. Load page by URI and get all required variables (meta, oembed, html etc.). If no requirements - page will not be loaded.  5. Go through all selected (used) methods.     2. Call method with selected params.     3. Wait for **cb** called if method is asynchronous or get result immediately.     4. Store received result or error.  6. Find methods with custom requirements which can be called with received data (from previous step).     1. If methods found - go to step 5.  7. Extract all links from saved data:     1. Generate info for links with [type: \&quot;x-safe-html\&quot;](#x-safe-html)     2. Generate info for links with [custom render](#rendering-templates)     3. Calculate images sizes and type if not provided.     4. Filter links without `href`.     5. Resolve href to URI (if relative path provided).     6. Skip duplicate links (by `href`).     7. Combine `http://` and `https://` similar links to one without protocol `//`.  8. Merge all **meta** to single object (data from highest priority plugins will override others).  9. Return **links** and **meta**.  "
});

documentTitles["/r3/docs/write-a-plugin.html#plugin-structure"] = "Plugin structure";
index.add({
    url: "/r3/docs/write-a-plugin.html#plugin-structure",
    title: "Plugin structure",
    body: "#### Plugin structure  "
});

documentTitles["/r3/docs/write-a-plugin.html#plugingetlinks"] = "plugin.getLink(s)";
index.add({
    url: "/r3/docs/write-a-plugin.html#plugingetlinks",
    title: "plugin.getLink(s)",
    body: "##### plugin.getLink(s)  "
});

documentTitles["/r3/docs/write-a-plugin.html#plugingetmeta"] = "plugin.getMeta";
index.add({
    url: "/r3/docs/write-a-plugin.html#plugingetmeta",
    title: "plugin.getMeta",
    body: "##### plugin.getMeta  `getMeta` function allow plugin to provide some page meta attributes.  Look at all meta plugins at: [/plugins/generic/meta](https://github.com/itteco/iframely/tree/master/plugins/generic/meta).  Names of attributes should be unified. Do not created different forms of one attribute name, like `author_url` and `author-url`. See available attributes names to check if similar name exists at [/meta-mappings](#meta-mappings).  **Warging!** As meta-mappings generated using regexp modules parsing, all attributes should be described in specific form:  - each attribute should be declared in separate line;  - no other functions with `return` are not expected inside `getMeta` function.  See example [/generic/meta/video.js](https://github.com/itteco/iframely/blob/master/plugins/generic/meta/video.js):      module.exports = {         getMeta: function(meta) {              // This prevents non useful errors loging with \&quot;undefined\&quot;.             if (!meta.video)                 return;              return {                 duration: meta.video.duration,  // This will extract video duration.                 date: meta.video.release_date,  // If value is undefined - it will be removed from meta.                 author: meta.video.writer,                 keywords: meta.video.tag             };         }     };  "
});

documentTitles["/r3/docs/write-a-plugin.html#plugingetmeta-priorities"] = "plugin.getMeta priorities";
index.add({
    url: "/r3/docs/write-a-plugin.html#plugingetmeta-priorities",
    title: "plugin.getMeta priorities",
    body: "###### plugin.getMeta priorities  Some plugins may return same meta attributes. This is possible if one attribute is described using different semantics. It happens that values of these attributes are different. We know some semantics are better then other. For example: html `&lt;title&gt;` tag often provides page title with site name, which is not really part of content title. But `og:title` usually better and contains only article title without site name.  If you want to mark you plugin as worst source of meta (like html `&lt;title&gt;` tag), use `lowestPriority: true`:      module.exports = {         lowestPriority: true     }  If you want to mark your plugin as good source of meta (like og:title), use `highestPriority: true`:      module.exports = {         highestPriority: true     }  So resulting priority of meta plugins will be following:   1. plugins with `highestPriority: true` will override all others plugins meta data.  1. meta from plugins without priority mark will override only `lowestPriority: true` plugins meta data.  1. data from plugins with `lowestPriority: true` will be used only if no other plugin provides that meta data.  "
});

documentTitles["/r3/docs/write-a-plugin.html#plugingetdata"] = "plugin.getData";
index.add({
    url: "/r3/docs/write-a-plugin.html#plugingetdata",
    title: "plugin.getData",
    body: "##### plugin.getData  "
});

documentTitles["/r3/docs/write-a-plugin.html#pluginmixins"] = "plugin.mixins";
index.add({
    url: "/r3/docs/write-a-plugin.html#pluginmixins",
    title: "plugin.mixins",
    body: "##### plugin.mixins  "
});

documentTitles["/r3/docs/write-a-plugin.html#plugintests"] = "plugin.tests";
index.add({
    url: "/r3/docs/write-a-plugin.html#plugintests",
    title: "plugin.tests",
    body: "##### plugin.tests  Example:      tests: [         {             feed: \&quot;http://gdata.youtube.com/feeds/api/videos\&quot;         },         {             pageWithFeed: \&quot;http://www.businessinsider.com/\&quot;         },         {             page: \&quot;http://500px.com/upcoming\&quot;,             selector: \&quot;.title a\&quot;,             getUrl: function(url) {                 return url.indexOf('ok') &gt; -1 ? url : null;                         }         },         {             skipMixins: [\&quot;og-title\&quot;],             skipMethods: [\&quot;getLink\&quot;]         },         \&quot;http://www.youtube.com/watch?v=etDRmrB9Css\&quot;     ]  Feeds:  * `feed` - rss/atom feed of links to test.  * `pageWithFeed` - \&quot;home\&quot; page with rss/atom link in page header, feed will be looked for links to test.  * `page` and `selector` - jquery selector on page to find `a` elements with `href` attribute with links to test.  * `getUrl` - this function allows to change or mark feed url as not usable by returning `null`.  Testing directives:  * `skipMethods` - array of non mandatory plugin methods. If method will not return data - it will be test warting, not error. Exceptions will raise error as usual.  * `skipMixins` - same as previous, but with mixin methods.  If you have test urls but there are no test feeds, specify following to prevent test warnings:      tests: [         {             noFeeds: true         },         \&quot;http://www.youtube.com/watch?v=etDRmrB9Css\&quot;     ]  If there are no any test urls, write:      tests: {         noTest: true     }  "
});

documentTitles["/r3/docs/write-a-plugin.html#type-of-plugins"] = "Type of plugins";
index.add({
    url: "/r3/docs/write-a-plugin.html#type-of-plugins",
    title: "Type of plugins",
    body: "#### Type of plugins  "
});

documentTitles["/r3/docs/write-a-plugin.html#generic-plugins"] = "Generic plugins";
index.add({
    url: "/r3/docs/write-a-plugin.html#generic-plugins",
    title: "Generic plugins",
    body: "##### Generic plugins  [/plugins/generic](https://github.com/itteco/iframely/tree/master/plugins/generic)   "
});

documentTitles["/r3/docs/write-a-plugin.html#meta-plugins"] = "Meta plugins";
index.add({
    url: "/r3/docs/write-a-plugin.html#meta-plugins",
    title: "Meta plugins",
    body: "###### Meta plugins  [/plugins/generic/meta](https://github.com/itteco/iframely/tree/master/plugins/generic/meta)   "
});

documentTitles["/r3/docs/write-a-plugin.html#domain-plugins"] = "Domain plugins";
index.add({
    url: "/r3/docs/write-a-plugin.html#domain-plugins",
    title: "Domain plugins",
    body: "##### Domain plugins  [/plugins/domains](https://github.com/itteco/iframely/tree/master/plugins/domains)   "
});

documentTitles["/r3/docs/write-a-plugin.html#custom-plugins"] = "Custom plugins";
index.add({
    url: "/r3/docs/write-a-plugin.html#custom-plugins",
    title: "Custom plugins",
    body: "##### Custom plugins  [/plugins/generic/custom](https://github.com/itteco/iframely/tree/master/plugins/generic/custom)   "
});

documentTitles["/r3/docs/write-a-plugin.html#template-plugins"] = "Template plugins";
index.add({
    url: "/r3/docs/write-a-plugin.html#template-plugins",
    title: "Template plugins",
    body: "##### Template plugins  [/plugins/templates](https://github.com/itteco/iframely/tree/master/plugins/templates)   "
});

documentTitles["/r3/docs/write-a-plugin.html#custom-links-cases"] = "Custom links cases";
index.add({
    url: "/r3/docs/write-a-plugin.html#custom-links-cases",
    title: "Custom links cases",
    body: "#### Custom links cases  "
});

documentTitles["/r3/docs/write-a-plugin.html#x-safe-html"] = "x-safe-html";
index.add({
    url: "/r3/docs/write-a-plugin.html#x-safe-html",
    title: "x-safe-html",
    body: "##### x-safe-html  ---------------------------------------  "
});

documentTitles["/r3/docs/write-a-plugin.html#meta-mappings"] = "/meta-mappings";
index.add({
    url: "/r3/docs/write-a-plugin.html#meta-mappings",
    title: "/meta-mappings",
    body: "#### /meta-mappings  Provides unified meta attributes mapping.  You can find current unified meta attributes mapping on [http://dev.iframe.ly/meta-mappings](http://dev.iframe.ly/meta-mappings).  Here is description of data:      {       \&quot;attributes\&quot;: [                           -- List of all supported attributes in alphabetic order.         \&quot;author\&quot;,         \&quot;author_url\&quot;,         ...       ],       \&quot;sources\&quot;: {                              -- Object with each attribute source.         \&quot;author\&quot;: [           {             \&quot;pluginId\&quot;: \&quot;twitter-author\&quot;,       -- Plugin in which meta attribute is defined.             \&quot;source\&quot;: \&quot;meta.twitter.creator\&quot;    -- Part of that plugin code which returns meta attribute value.           },           ...         ],         ...       }     }  Meta attributes provided by plugins [getMeta](plugingetmeta) method.  ---------------------------------------  "
});

documentTitles["/r3/docs/write-a-plugin.html#readerjs"] = "/reader.js";
index.add({
    url: "/r3/docs/write-a-plugin.html#readerjs",
    title: "/reader.js",
    body: "#### /reader.js  Endpoint for article rendering scripts.  **Method:** GET  **Params:**  - `uri` - page uri to be processed.  **Returns:** JavaScript widget to render article.  This is behind scenes endpoint. It is not directly used by developer. Link to endpoint is automatically generated for internal MIME type `\&quot;text/x-safe-html\&quot;`. See [x-safe-html](#x-safe-html) for details.  Endpoint will return JavaScript widget to embed it with `&lt;script&gt;` tag. Embedding will be completed by [iframely.js](#javascript-client-lib-iframelyjs) lib.  ---------------------------------------  "
});

documentTitles["/r3/docs/write-a-plugin.html#render"] = "/render";
index.add({
    url: "/r3/docs/write-a-plugin.html#render",
    title: "/render",
    body: "#### /render  Endpoint to cusrom rendered widgets.  **Method:** GET  **Params:**  - `uri` - page uri to be processed.  **Returns:** html page with widget.  This is behind scenes endpoint. It is not directly used by developer. Link to endpoint is automatically generated for internal MIME type `\&quot;text/html\&quot;` with `template_context` or `template` attributes provided by plugin. See [rendering templates](#rendering-templates) for details.  Result will be embedded with `&lt;iframe&gt;`. Embedding and resizing will be completed by [iframely.js](#javascript-client-lib-iframelyjs) lib.   "
});

documentTitles["/r3/docs/write-a-plugin.html#rendering-templates"] = "Rendering templates.";
index.add({
    url: "/r3/docs/write-a-plugin.html#rendering-templates",
    title: "Rendering templates.",
    body: "##### Rendering templates.  "
});

documentTitles["/r3/docs/write-a-plugin.html#resize-embedded-iframe-from-inside-iframe"] = "Resize embedded iframe from inside iframe.";
index.add({
    url: "/r3/docs/write-a-plugin.html#resize-embedded-iframe-from-inside-iframe",
    title: "Resize embedded iframe from inside iframe.",
    body: "##### Resize embedded iframe from inside iframe."
});


