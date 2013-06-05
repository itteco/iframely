# Iframely [![Build Status](https://travis-ci.org/itteco/iframely.png?branch=master)](https://travis-ci.org/itteco/iframely)

oEmbed/2 gateway endpoint

Look at example debug tool urls to see how it works:

 - http://dev.iframe.ly/debug?uri=http%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D_l96hPlqzcI
 - http://dev.iframe.ly/debug?uri=http%3A%2F%2Fvimeo.com%2F67487897
 - http://dev.iframe.ly/debug?uri=http%3A%2F%2Fmashable.com%2F2013%2F06%2F05%2Fdominos-drone%2F
 - http://dev.iframe.ly/debug?uri=http%3A%2F%2Fwww.flickr.com%2Fphotos%2Fnf39%2F8941500522%2F

## Server setup

### Installation

Node.js 0.8-0.10 required. Install if from [pre-built installer](http://nodejs.org/download/) for your platform or from [package managers](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager).

    cd <your servers dir>
    git clone https://github.com/itteco/iframely.git
    cd iframely
    npm install

### Config

    cp config.local.js.SAMPLE config.local.js
    vi config.local.js

Setup values listed in config as you wish. You may override any values from config.js.

### Run server

    node server

Also you can use [forever](https://github.com/nodejitsu/forever):

    npm install -g forever
    forever start -l iframely.log server.js

### Server debug tool

You can test server API with debug tool at:

 - [http://localhost:8061/debug?uri=http%3A%2F%2Fvimeo.com%2F67487897](http://localhost:8061/debug?uri=http%3A%2F%2Fvimeo.com%2F67487897)

### Run tests

    npm test

All functionality is not covered by tests for now. Tests depends on non stable web pages and sometimes crashes for no reason.

## Documentation

### Using as npm package

Install:

    npm install iframely

Usage:

    var iframely = require("iframely");

    // TODO: doc on iframely.getRawLinks
    // TODO: doc on iframely.getPageData
    // TODO: doc on iframely.getImageMetadata

---------------------------------------

### Using REST API

#### /oembed2

#### /meta-mappings

#### /reader.js

#### /render

---------------------------------------

### JavaScript client lib iframely.js

#### Fetching oEmbed/2

#### Rendering links

---------------------------------------

### Writing plugins

#### plugin.getLink(s)

#### plugin.getMeta

#### plugin.getData

#### Generic plugins

##### Meta plugins

#### Domain plugins

#### Custom plugins

