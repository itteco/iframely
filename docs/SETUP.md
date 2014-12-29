# Deploy Iframely to Your Own Servers

The source-code of [Iframely APIs](https://iframely.com) is hosted [on GitHub](https://github.com/itteco/iframely). It's the Node.js code published under MIT license. You can start self-hosting any time, as APIs are nearly identical (except the hosted version requires API key and can output the HTML of hosted widgets via [Short URLs](https://iframely.com/docs/url-shortener)).

Here are the instructions to get your instance of APIs up and running.

## Stay Secure - Host on Dedicated Domain

It is highly recommended that you install the parsers on a dedicated domain. 

There are few cases, when rendering of embed content is required by the server, for example the articles. Even though Iframely tries to detect and eliminate any insecure code of 3rd parties, for cross-domain security of your application, it will be wiser to keep render endpoints under different domain and allow your main domain in CORS settings (see config options below).



## Initial Installation

Node.js version 0.8 and higher is required (was tested up to 0.10). Install it from [pre-built installer](http://nodejs.org/download/) for your platform or from any of the [package managers](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager).

    cd <your servers dir>
    git clone https://github.com/itteco/iframely.git
    cd iframely
    npm install

It will also install all the package dependencies.


## Configure Iframely

Please, create your local config file to adjust settings. This local config file will be ignored when you pull new versions from Git later on.

    cp config.local.js.SAMPLE config.local.js
    vi config.local.js

Edit the sample config file as you need. You may also override any values from main config.js in your local config.

At the very least, you need to properly configure:

- `baseAppUrl` - the domain you host Iframely Gateway on. This is required for some embeds that need custom renders.
- `CACHE_ENGINE` - the caching middleware you'd prefer to use (No Cache, Redis, Memcached or Node.js in-memory cache)
- If you chose Redis or Memcached, you need to connect Iframely gateway with these systems
- `allowedOrigins` - very important to list your main app's domain(s) here, and block access to others 


There are also some provider-specific values that are required for some domain plugins to work (e.g. wheather to include media in Twitter status embeds). Please, enter your own application keys and secret tokens where applicable. Parsers for Twitter, Flickr and Tumblr won't work without the access tokens to their APIs.


Readability parser to get the HTML of the articles is optional and is turned off by default as it affects the processing time of the URLs. If need be, you can also fine-tune API response time by disabling image size detection.


## Run Server

Starting the server is simple. From Iframely home directory:

    node server

To run server in cluster mode, use

    node cluster


We highly recommend using [Forever](https://github.com/nodejitsu/forever) though. It makes stopping and restarting of the servers so much easier:

    npm install -g forever
    forever start -l iframely.log cluster.js


For production deployments, we recommend the cluster mode. It will properly utilize the CPU if you are on multiple cores. Plus, as with any Node.js memory buffers, it is beneficial for performance to peridically restart the running processes.


## Add Required Locations to Your Reverse Proxy

Depending on your setup, you may need to configure these pathes in your reverse proxy settings to point to Iframely's Node.js instance:

    /r/.+               -- static files (including iframely.js client library)
    /iframely           -- main API endpoint with get params 
    /oembed             -- oEmbed API endpoint
    /debug              -- optional debugger UI, if you write your own domain plugins
    /reader.js          -- API endpoint with get params - proxies script to render article
    /render             -- API endpoint with get params - prexies custom widgets if required
    /meta-mappings      -- optional API endpoint with available unified meta
    /supported-plugins-re.json - the list of regexps for plugins



## Update Iframely

Please, keep Iframely up-to-date as we keep adding features or releasing fixes. 


Custom domain plugins may be returning invalid data if your Iframely instance is obsolete. The domain plugins are error-prone due to dependencies to 3rd parties. Domain plugins do break from time to time, and we'll release hot fixes in this case. Please, follow [Iframely on Twitter](http://twitter.com/iframely) to get timely heads up when hot fixes are required.


To update Iframely package to its latest version run from Iframely home directory:

    git pull
    
and restart your server afterwards. If you use [Forever](https://github.com/nodejitsu/forever), run for example:

    forever restartall

If you fork, make sure to merge from the upstream for the newer versions.



(c) 2013 [Itteco Software Corp](http://itteco.com). Licensed under MIT. [Get it on Github](https://github.com/itteco/iframely)