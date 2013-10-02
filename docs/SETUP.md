# Deploy Iframely Gateway to Your Own Servers



## Stay Secure - Host on Dedicated Domain

It is highly recommended that you install [Iframely Gateway](http://iframely.com/gateway) on a dedicated domain. 

There are few cases, when rendering of embed content is required by the server, for example the articles. Even though Iframely tries to detect and eliminate any insecure code of 3rd parties, for cross-domain security of your application, it will be wiser to keep render endpoints under different domain and allow your main domain in CORS settings (see config options below).



## Initial Installation

Node.js version 0.8 and higher is required (was tested up to 0.10). Install it from [pre-built installer](http://nodejs.org/download/) for your platform or from any of the [package managers](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager).

    cd <your servers dir>
    git clone https://github.com/itteco/iframely.git
    cd iframely
    npm install

It will also install all the package dependencies.

If you're using Mac OS, you might need to install [ImageMagic CLI](http://www.imagemagick.org/script/binary-releases.php#macosx) tools to make image size detection work. 


## Configure Iframely

Please, create your local config file to adjust settings. This local config file will be ignored when you pull new versions from Git later on.

    cp config.local.js.SAMPLE config.local.js
    vi config.local.js

Edit the sample config file as you need. You may also override any values from main config.js in your local config.

At the very least, you need to properly configure:

- `baseAppUrl` - the domain you host Iframely Gateway on
- `CACHE_ENGINE` - the caching middleware you'd prefer to use (No Cache, Redis, Memcached or Node.js in-memory cache)
- If you chose Redis or Memcached, you need to connect Iframely gateway with these systems
- `allowedOrigins` - very important to list your main app's domain(s) here, and block access to others 

There are also some provider-specific values you might want to configure (e.g. wheather to include media in Twitter status embeds). Please, enter your own application keys and secret tokens where applicable

You can also fine-tune API response time by disabling image size detection or readability parsing. 



## Run Server

Starting the server is simple. From Iframely home directory:

    node server

We highly recommend using [Forever](https://github.com/nodejitsu/forever) though. It makes stopping and restarting of the servers so much easier:

    npm install -g forever
    forever start -l iframely.log server.js



## Add Required Locations to Your Reverse Proxy

Depending on your setup, you may need to configure these pathes in your reverse proxy settings to point to Iframely's Node.js instance:

    /r/.+               -- static files (including iframely.js client library)
    /iframely           -- main API endpoint with get params - returns oEmbed/2 as JSON
    /oembed             -- wrapper around main API. Returns oEmbed v1 JSON and other meta
    /debug              -- optional debugger UI with get params
    /reader.js          -- API endpoint with get params - proxies script to render article
    /render             -- API endpoint with get params - prexies custom widgets if required
    /meta-mappings      -- optional API endpoint with available unified meta



## Update Iframely

Please, update Iframely Gateway as we keep adding features or releasing fixes. 

The domain plugins are error-prone due to dependencies to 3rd parties. Domain plugins do break from time to time, and we'll release hot fixes in this case. Please, follow [Iframely on Twitter](http://twitter.com/iframely) to get timely heads up when hot fixes are required.


To update Iframely package to its latest version run from Iframely home directory:

    git pull
    
and restart your server afterwards. If you use [Forever](https://github.com/nodejitsu/forever), run for example:

    forever restartall