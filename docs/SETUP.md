## Server setup

- [Security considerations](#security-considerations)
- [Installation](#installation)
- [Config](#config)
- [Run server](#run-server)
- [List of server urls](#list-of-server-urls)
- [Server debug tool](#server-debug-tool)
- [Update iframely](#update-iframely)

### Security considerations

It is highly recommended that you install the server on a separate domain. There are few cases, when rendering of embed content is required by the server, for example the articles. Even though iframely tries to eliminate any insecure code of 3rd parties, for cross-domain security of your application, it will be wiser to keep render endpoints under different domain and allow your main domain in CORS settings (see [config options](#config)).

### Installation

Node.js versions 0.8-0.10 required. Install if from [pre-built installer](http://nodejs.org/download/) for your platform or from [package managers](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager).

    cd <your servers dir>
    git clone https://github.com/itteco/iframely.git
    cd iframely
    npm install

It will also install all the package dependencies.

If you're using Mac OS, you might need to install ImageMagic CLI tools to make image size detection work. 

### Config

Please, create your local config file to adjust settings. This local config file will be ignored when you update versions from Git later on.

    cp config.local.js.SAMPLE config.local.js
    vi config.local.js

Edit the sample config file as you need. You may also override any values from main config.js in your local config.
There are some provider-specific values you might want to configure (e.g. wheather to include media in Twitter status embeds).
You can also fine-tune API response time by disabling image size detection or readability parsing. 

For enhanced security, it is important that you properly configure `allowedOrigins` parameter for CORS.

__Important__: At the very least, you need to enter your own application keys and secret tokens where applicable. 


### Run server

Starting server is simple. From iframely home directory:

    node server

We highly recommend [forever](https://github.com/nodejitsu/forever) though as it makes stopping and restarting of the servers so much easier:

    npm install -g forever
    forever start -l iframely.log server.js


### List of server urls

You may need to configure these in your reverse proxy settings, depending on your setup:

    /r/.+               -- static files (including iframely.js client library).
    /iframely           -- main API endpoint with get params - returns oEmbed/2 as JSON.
    /debug              -- debugger UI with get params.
    /reader.js          -- API endpoint with get params - proxies script to render article.
    /render             -- API endpoint with get params - prexies custom widgets if required.
    /meta-mappings      -- API endpoint with available unified meta.

### Server debug tool

You can visualize server API with debug tool at:

 - [http://localhost:8061/debug](http://localhost:8061/debug), try [example](http://localhost:8061/debug?uri=http%3A%2F%2Fvimeo.com%2F67487897)

If your local configuration turns debug mode on, the debug tool will also show the debug information for the plugins used (useful when developing plugins - see Wiki for how to write plugins)

### Update iframely

As we keep adding features, you may want to update your server. The domain providers due to dependencies to 3rd parties do break from time to time, and we'll release hot fixes in this case. Please, follow [Iframely on Twitter](http://twitter.com/iframely) to get timely heads up when hot fixes are required.

To update a package to it's latest version run in iframely home directory:

    git pull
    
and restart your server. If you use forever, run:

    forever restartall