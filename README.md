# Iframely

[![Build Status](https://travis-ci.org/itteco/iframely.png?branch=master)](https://travis-ci.org/itteco/iframely)

oEmbed/2 gateway endpoint

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

Setup values listed values as you with. You may override any values from config.js.

### Run server

    node server

Also you can use forever:

    npm install -g forever
    forever start -l iframely.log server.js

### Server debug tool

You can test server API with debug tool at:

    http://localhost:8061/debug

### Run tests

    npm install vows
    npm run-script test

All functionality is not covered by tests for now.

## Documentation

### Using as npm package

Install:

    npm install iframely

Usage:

    var iframely = require("iframely");

    // TODO: doc on iframely.getRawLinks
    // TODO: doc on iframely.getPageData
    // TODO: doc on iframely.getImageMetadata

## Using REST API

    /oembed2

    /meta-mappings

    /reader.js

    /render