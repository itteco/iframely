# Self-host Iframely APIs

The source-code of [Iframely](https://iframely.com) parsers engine is hosted [on GitHub](https://github.com/itteco/iframely). It's a Node.js library and server published under MIT license. You can start self-hosting any time, as APIs are nearly identical (except the hosted version requires API key and can output the HTML of [smart iFrames](https://iframely.com/docs/iframes)).

Here are the instructions to get your instance of APIs up and running.

## Stay Secure - Host on Dedicated Domain

It is highly recommended that you install the parsers on a dedicated domain. 

There are few cases, when rendering of embed content is required by the server, for example the articles. Even though Iframely tries to detect and eliminate any insecure code of 3rd parties, for cross-domain security of your application, it will be wiser to keep render endpoints under different domain and allow your main domain in CORS settings (see config options below).



## Initial Installation

Node.js version 7 and higher is required (was tested up to 12.9.0). Install it from [pre-built installer](http://nodejs.org/download/) for your platform or from any of the [package managers](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager).

    cd <your servers dir>
    git clone https://github.com/itteco/iframely.git
    cd iframely
    npm install

It will also install all the package dependencies.

If you see error `../lib/kerberos.h:5:27: fatal error: gssapi/gssapi.h: No such file or directory` during `npm install` then try install `libkrb5-dev`:

    sudo apt-get install libkrb5-dev


## Configure Iframely

Please create your local config file and adjust settings. This local config file will be ignored when you pull new versions from Git later on.

    cp config.local.js.SAMPLE config.local.js
    vi config.local.js

If you support various environment configs and pass it as `NODE_ENV`, create config files that match your enviroments. For example, `config.develop.js`.

Edit the sample config file as you need. Follow the comments put in `config.local.js.SAMPLE` for particular settings. You may also override any values from main config.js in your local config.


There are also some provider-specific values that are required for some domain plugins to work (e.g. Google API key for maps and YouTube). Please, enter your own application keys and secret tokens where applicable.


Readability parser to get the HTML of the articles is optional and is turned off by default as it affects the processing time of the URLs. If need be, you can also fine-tune API response time by disabling image size detection.

## Configure cache storage

Iframely has built-in cache with support of Memcached, Redis and Node.js in-memory cache module. 

In your local config file, define caching parameters:

        CACHE_ENGINE: 'memcached',
        CACHE_TTL: 0, // In milliseconds. 0 for 'never expire' to let cache engine decide itself when to evict the record


Valid cache engine values are `no-cache`, `node-cache` (default), `redis` and `memcached`. For Redis and Memcached, the connection options are also required. See sample config file.


## Run Server

Starting the server is simple. From Iframely home directory:

    node server

To run server in cluster mode, use

    node cluster

We highly recommend using [PM2](https://github.com/Unitech/pm2) or [Forever](https://github.com/nodejitsu/forever) process managers. It makes stopping and restarting of the servers so much easier:

Forever:

    npm install forever -g
    forever start -a -l iframely.log --killSignal=SIGTERM cluster.js
    forever logs 0 -fifo

PM2:

    npm install pm2 -g
    pm2 start pm2.json
    pm2 logs

    
If you use 'node cluster' or [Forever](https://github.com/nodejitsu/forever) you can do graceful server restart without aborting active user connections. Just send 'SIGUSR2' signal to 'cluster.js' process:

    pkill -USR2 iframely-c


Graceful reload with [PM2](https://github.com/Unitech/pm2):

    pm2 reload iframely


For production deployments, we recommend the cluster mode. It will properly utilize the CPU if you are on multiple cores. Plus, as with any Node.js memory buffers, it is beneficial for performance to peridically restart the running processes.
    



## Add Required Locations to Your Reverse Proxy

Depending on your setup, you may need to configure these paths in your reverse proxy settings to point to Iframely's Node.js instance:

    /iframely           -- main API endpoint with get params 
    /oembed             -- oEmbed API endpoint
    /r/.+               -- static files (including iframely.js client library)    
    /debug              -- optional debugger UI, if you write your own domain plugins
    /reader.js          -- API endpoint with get params - proxies script to render article
    /render             -- API endpoint with get params - prexies custom widgets if required
    /meta-mappings      -- optional API endpoint with available unified meta
    /supported-plugins-re.json - the list of regexps for plugins

## Your self-hosted endpoints

You can now access your self-hosted API on your domain as `/iframely?url=` and `/oembed?url=` with any optional [query-string parameters](https://iframely.com/docs/parameters) supported by open-source version.


## Update Iframely

Please, keep Iframely up-to-date as we keep adding features or releasing fixes. 


Custom domain plugins may be returning invalid data if your Iframely instance is obsolete. The domain plugins are error-prone due to dependencies to 3rd parties. Domain plugins do break from time to time. Keeping Iframely up-to-date is important.


To update Iframely package to its latest version run from Iframely home directory:

    git pull
    
and restart your server afterwards. If you use [Forever](https://github.com/nodejitsu/forever), run for example:

    forever restartall
    
or in case of [PM2](https://github.com/Unitech/pm2):

    pm2 reload iframely

If you fork, make sure to merge from the upstream for the newer versions.


## Docker

The Docker container will:

 * Run locally on your machine
 * Run forever start cluster.js by default
 * Run forever start <args> if command line arguments are supplied
 * Gracefully shutdown when receiving SIGTERM from docker stop

    docker build -t iframely:latest .
    docker run -it -p 8061:8061 -v $PWD/config.local.js:/iframely/config.local.js --name iframely iframely:latest
    docker stop iframely

Ignore any build warnings from NPM on OSX (Darwin).

A longer documentation with docker build instructions (tags/forked repo) for upload to docker hub is available here: [DOCKER-BUILD-INSTRUCTION.md](https://github.com/itteco/iframely/blob/master/docs/DOCKER-BUILD-INSTRUCTION.md).

## Ansible + Vagrant

If you use Ansible for deployments a role + playbook is available in [ansible-docker-iframely](https://github.com/itteco/iframely/tree/master/ansible-docker-iframely). This role utilizes docker hub for image retrival. Feel free to modify it to your like.
+
You can run tests and setups yourself with the vagrant file in the dir and run
    
    vagrant up

(c) 2013-2019 [Itteco Software Corp](http://itteco.com). Licensed under MIT. [Get it on Github](https://github.com/itteco/iframely)
